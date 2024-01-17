import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import { enumType, object } from "valibot";
import type { WealthyPresence } from "wealthy-presence";

export default function statusRouterBuilder(presence: WealthyPresence) {
  return new Hono()
    .get("/", c => c.json(presence.isRunning()))
    .post(
      "/",
      vValidator(
        "json",
        object({
          action: enumType(["start", "stop"]),
        }),
      ),
      async c => {
        if (c.req.valid("json").action === "start") await presence.start();
        else await presence.stop();
        return c.json("hey");
      },
    );
}
