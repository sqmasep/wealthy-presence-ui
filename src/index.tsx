import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { WealthyPresence, createPreset } from "wealthy-presence";
import { cors } from "hono/cors";

function withWeb(presence: WealthyPresence, config?: { port?: number }) {
  const app = new Hono();

  const defaultPresets = presence.getPresets();

  // CORS
  app.use("*", cors());

  // home
  app.use("/static/*", serveStatic({ root: "./" }));
  app.use("/assets/*", serveStatic({ root: "./web/dist/" }));
  app.get("/", (c, next) => {
    return serveStatic({ path: "./web/dist/index.html" })(c, next);
  });

  app.get("/presets", c => c.json(presence.getPresets()));
  app.post("/presets", c => {
    presence.addPreset(createPreset({ title: "test" }));
    return c.json(presence.getPresets(), 201);
  });

  app.post("/set-preset", async c => {
    console.log(await c.req.parseBody());
    presence.setPresets([
      createPreset({
        title: "only preset now",
        description: "isnt it that cool",
      }),
    ]);
    return c.json(presence.getPresets(), 200);
  });

  app.delete("/delete-preset", async c => {
    // TODO validate id (maybe use "/preset/:id" instead of "/delete-preset")
    presence.removePreset((await c.req.json())?.id);
    return c.json(presence.getPresets(), 200);
  });

  app.post("/restore-state", c => {
    presence.setPresets(defaultPresets);
    return c.json(presence.getPresets(), 200);
  });

  app.post("/run", async c => {
    try {
      await presence.run();
      return c.json({ message: "Running" }, 200);
    } catch (error) {
      return c.json({ message: "Something went wrong" }, 500);
    }
  });

  app.post("/stop", async c => {
    await presence.stop();
    return c.json({ message: "Stopped" }, 200);
  });

  app.get("/is-running", c => {
    return c.json({ isRunning: presence.isRunning() }, 200);
  });

  serve(
    {
      fetch: app.fetch,
      port: config?.port ?? 4232,
    },
    info => console.log("Listening on port", info.port, "🚀"),
  );
}

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
  ],
});

withWeb(presence);

presence.run();
