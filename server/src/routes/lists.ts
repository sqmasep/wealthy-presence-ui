import { Hono } from "hono";
import type { WealthyPresence } from "wealthy-presence";
import { idValidator } from "~/lib/validation/server-only";
import parsePreset from "~/utils/parsePreset";

export default function listsRouterBuilder(presence: WealthyPresence) {
  return new Hono()
    .get("/", async c => {
      const lists = presence.getLists();
      const transformedLists = await Promise.all(
        lists.map(async list => ({
          ...list,
          presets: await Promise.all(list.presets.map(parsePreset)),
        })),
      );

      return c.json(transformedLists);
    })
    .post("/play", idValidator, async c => {
      presence.playList(c.req.valid("json").id);

      const lists = presence.getLists();
      const transformedLists = await Promise.all(
        lists.map(list => ({
          ...list,
          presets: list.presets.map(parsePreset),
        })),
      );

      return c.json(transformedLists);
    });
}
