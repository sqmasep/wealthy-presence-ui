import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { WealthyPresence, createPreset } from "wealthy-presence";
import { cors } from "hono/cors";
import { idValidator } from "./lib/validation/server-only";

async function parsePreset(
  preset: ReturnType<WealthyPresence["getPresets"]>[number],
) {
  return {
    id: preset.id,
    // WARN does not take into account mixed presets (with functions for each field) yet
    type: typeof preset.value === "function" ? "function" : "object",
    value:
      typeof preset.value === "function" ? await preset.value() : preset.value,
  } as const;
}

function withWeb(presence: WealthyPresence, config?: { port?: number }) {
  const defaultPresets = presence.getPresets();

  const app = new Hono()
    // CORS
    .use("*", cors())

    // Static files
    .use("/assets/*", serveStatic({ root: "./web/dist/" }))

    // React app
    .get("/", (c, next) => {
      return serveStatic({ path: "./web/dist/index.html" })(c, next);
    })

    // Presets
    .get("/all-presets", async c => {
      const parsedPresets = defaultPresets.map(async preset => {
        const res = await parsePreset(preset);
        return res;
      });

      return c.json(await Promise.all(parsedPresets));
    })
    .get("/queue", async c => {
      const parsedPresets = presence.getPresets().map(async preset => {
        const res = await parsePreset(preset);
        return res;
      });

      return c.json(await Promise.all(parsedPresets));
    })
    .post("/queue", idValidator, async c => {
      const foundPreset = defaultPresets.find(
        preset => preset.id === c.req.valid("json").id,
      );

      if (!foundPreset) return c.json({ message: "Preset not found" }, 404);

      presence.addPreset(foundPreset);
      return c.json(presence.getPresets(), 201);
    })
    .delete("/queue-item", idValidator, async c => {
      presence.removePreset((await c.req.json())?.id);
    })

    .post("/presets", c => {
      presence.addPreset(createPreset({ title: "test" }));
      return c.json(presence.getPresets(), 201);
    })
    .post("/set-preset", idValidator, async c => {
      const foundPreset = defaultPresets.find(
        preset => preset.id === c.req.valid("json").id,
      );

      if (!foundPreset) return c.json({ message: "Preset not found" }, 404);

      presence.setPresets([foundPreset]);
      return c.json(presence.getPresets(), 200);
    })
    .delete("/delete-preset", async c => {
      // TODO validate id (maybe use "/preset/:id" instead of "/delete-preset")
      presence.removePreset((await c.req.json())?.id);
      return c.json(presence.getPresets(), 200);
    })

    .post("/restore-state", c => {
      presence.setPresets(defaultPresets);
      return c.json(presence.getPresets(), 200);
    })

    .post("/run", async c => {
      try {
        await presence.run();
        return c.json({ message: "Running" }, 200);
      } catch (error) {
        return c.json({ message: "Something went wrong" }, 500);
      }
    })

    .post("/stop", async c => {
      await presence.stop();
      return c.json({ message: "Stopped" }, 200);
    })

    .get("/is-running", c => {
      return c.json({ isRunning: presence.isRunning() }, 200);
    });

  serve(
    {
      fetch: app.fetch,
      port: config?.port ?? 4232,
    },
    info => console.log("Listening on port", info.port, "🚀"),
  );

  return app;
}

export type WealthyPresenceApi = ReturnType<typeof withWeb>;

const presence = new WealthyPresence({
  appId: process.env.APP_ID!,
  presets: [
    createPreset({
      title: "HTMX is bad actually",
      description: "my things working so good",
      largeImageUrl:
        "https://media0.giphy.com/media/8vRvucL4OhyjyM4A8T/giphy.gif",
      smallImageUrl:
        "https://media0.giphy.com/media/8vRvucL4OhyjyM4A8T/giphy.gif",
    }),
    createPreset({ title: "Building the web", description: "Yes" }),
    createPreset(() => ({
      title: "function-like preset",
      description: "should not work",
    })),
  ],
});

const app = withWeb(presence);
