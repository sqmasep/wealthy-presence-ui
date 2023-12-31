import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { WealthyPresence } from "wealthy-presence";
import { Layout } from "./ui/layout";
import { Button } from "./ui/components/Button";
import { CloseIcon } from "./ui/icons/CloseIcon";
import { PlayIcon } from "./ui/icons/PlayIcon";

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

  app.post("/set-preset", async c => {
    presence.setPresets([
      { title: "only preset now", description: "isnt it that cool" },
    ]);
    return c.html("updated");
  });

  app.post("/stop", async c => {
    await presence.stop();
    return c.html(
      <Button variant="primary" hx-post="/run" hx-swap="outerHTML">
        Run <PlayIcon />
      </Button>,
    );
  });

  app.post("/run", async c => {
    await presence.run();
    return c.html(
      <Button variant="destructive" hx-post="/stop" hx-swap="outerHTML">
        Stop <CloseIcon />
      </Button>,
    );
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
      title: "trying some HTMX",
      description: "seems to work with wealthy-presence :)",
      largeImageUrl:
        "https://media0.giphy.com/media/8vRvucL4OhyjyM4A8T/giphy.gif",
      smallImageUrl:
        "https://media0.giphy.com/media/8vRvucL4OhyjyM4A8T/giphy.gif",
    },
  ],
});

withWeb(presence);
