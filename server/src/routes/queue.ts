import { Hono } from "hono";
import type { WealthyPresence } from "wealthy-presence";
import { idValidator } from "~/lib/validation/server-only";
import parsePreset from "~/utils/parsePreset";

export default function queueRouterBuilder(presence: WealthyPresence) {
  return new Hono()
    .get("/", async c => {
      const queue = presence.getQueue();
      const parsedPresets = queue.presets.map(parsePreset);
      const awaited = await Promise.all(parsedPresets);

      return c.json(awaited, 200);
    })
    .post("/add-by-id", idValidator, async c => {
      const id = c.req.valid("json").id;

      presence.getLists().forEach(list => {
        const preset = list.presets.find(preset => preset.id === id);
        if (presence.getQueue().presets.find(preset => preset.id === id))
          return;
        if (preset) presence.addPresetToQueue(preset);
      });
    })
    .post("/set", idValidator, c => {
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
    .delete("/clear", c => {})
    .delete("/remove-by-id", idValidator, async c => {
      console.log(c.req.valid("json").id);
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
