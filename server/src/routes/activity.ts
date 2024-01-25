import { Hono } from "hono";
import type { WealthyPresence } from "wealthy-presence";
import { idValidator } from "~/lib/validation/server-only";

export function activityRouterBuilder(presence: WealthyPresence) {
  return new Hono().post("/set-by-id", idValidator, async c => {
    const id = c.req.valid("json").id;
    const foundPreset = presence
      .getLists()
      .flatMap(list => list.presets)
      .find(preset => preset.id === id);

    if (!foundPreset) return c.json({ message: "Preset not found" }, 404);

    await presence.setActivity(foundPreset);

    return c.json(foundPreset, 200);
  });
}
