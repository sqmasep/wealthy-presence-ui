import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { WealthyPresence } from "wealthy-presence";
import { Layout } from "./ui/layout";

function withWeb(presence: WealthyPresence, config?: { port?: number }) {
  const app = new Hono();

  // CSS stuff
  app.use("/static/*", serveStatic({ root: "./" }));

  // home
  app.get("/", async c => c.html(<Layout presets={presence.getPresets()} />));

  app.post("set-activity", async c => {
    await presence.setActivity({
      title: "updated with a GUI! imagine that",
    });
    return c.html("updated");
  });

  app.post("stop", async c => {
    await presence.stop();
    return c.html("stopped");
  });

  app.post("run", async c => {
    await presence.run();
    return c.html("running");
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
    {
      title: "test3",
      description: "desc",
      largeImageUrl:
        "https://media0.giphy.com/media/8vRvucL4OhyjyM4A8T/giphy.gif",
      smallImageUrl:
        "https://media0.giphy.com/media/8vRvucL4OhyjyM4A8T/giphy.gif",
    },
    { title: "test2", description: "hey" },
  ],
});

withWeb(presence);

// presence.run();
