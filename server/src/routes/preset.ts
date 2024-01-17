import { Hono } from "hono";
import type { WealthyPresence } from "wealthy-presence";

export default function presetRouterBuilder(presence: WealthyPresence) {
  return new Hono().get("/", c => {
    // return c.json(presence.getQueue());
  });
}
