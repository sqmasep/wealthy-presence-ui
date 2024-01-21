import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import { number, object } from "valibot";
import type { WealthyPresence } from "wealthy-presence";
import { idValidator, idsValidator } from "~/lib/validation/server-only";
import parsePreset from "~/utils/parsePreset";

export default function queueRouterBuilder(presence: WealthyPresence) {
  return new Hono()
    .get("/", async c => {
      const queue = presence.getQueue();
      const parsedPresets = queue.presets.map(parsePreset);
      const awaited = await Promise.all(parsedPresets);

      return c.json(awaited, 200);
    })
    .post("/set-by-ids", idsValidator, async c => {
      const ids = c.req.valid("json").ids;
      const lists = presence.getLists();

      presence.setQueue(
        ids
          .map(id => {
            for (const list of lists) {
              const preset = list.presets.find(preset => preset.id === id);

              if (preset) return preset;
            }
          })
          .filter(Boolean),
      );

      return c.json(presence.getQueue(), 200);
    })
    .post("/add-by-id", idValidator, async c => {
      const id = c.req.valid("json").id;
      const lists = presence.getLists();
      const queue = presence.getQueue();

      for (const list of lists) {
        const preset = list.presets.find(preset => preset.id === id);

        // If already in the queue
        if (queue.presets.find(preset => preset.id === id))
          return c.json(queue, 200);

        if (preset) presence.addPresetToQueue(preset);
      }

      return c.json(presence.getQueue(), 201);
    })
    .post("/set-one", idValidator, c => {
      const foundPreset = presence
        .getLists()
        .flatMap(list => list.presets)
        .find(preset => preset.id === c.req.valid("json").id);

      if (!foundPreset) return c.json({ error: "Preset not found" }, 404);

      presence.setQueue([foundPreset]);

      const queue = presence.getQueue();
      const parsedPresets = queue.presets.map(parsePreset);
      const awaited = Promise.all(parsedPresets);

      return c.json({
        ...queue,
        presets: awaited,
      });
    })
    .post("/set-index", vValidator("json", object({ index: number() })), c => {
      const index = c.req.valid("json").index;
      presence.experimental$setCurrentQueueIndex(index);

      return c.json(presence.getQueue(), 200);
    })
    .delete("/clear", c => {})
    .delete("/remove-by-id", idValidator, async c => {
      presence.removePresetFromQueue(c.req.valid("json").id);

      const queue = presence.getQueue();
      const parsedPresets = queue.presets.map(parsePreset);
      const awaited = await Promise.all(parsedPresets);
      return c.json({
        ...queue,
        presets: awaited,
      });
    });
}
