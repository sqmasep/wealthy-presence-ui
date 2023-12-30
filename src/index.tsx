import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import type { FC } from "hono/jsx";
import { WealthyPresence } from "../../wealthy-presence/src/index";

const Layout: FC = async ({ presets }: { presets: { title: string }[] }) => (
  <html>
    <head>
      <title>hey</title>
      <link rel="stylesheet" href="/static/css/output.css" />
    </head>

    <body class="bg-zinc-950 text-white">
      <div class="">
        <h1>hey</h1>
        <p>epic</p>
        <button hx-post="/setActivity" hx-swap="outerHTML">
          Set Activity
        </button>

        {presets.map(async preset => (
          <div>{preset.title}</div>
        ))}
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
      </div>
    </body>
  </html>
);

function withWeb(presence: WealthyPresence, config?: { port?: number }) {
  const app = new Hono();
  app.use("/static/*", serveStatic({ root: "./" }));

  app.get("/", async c => c.html(<Layout />));

  app.post("setActivity", async c =>
    // await presence.setActivity({
    //   title: "updated with a GUI! imagine that",
    // });
    c.html(JSON.stringify("updated")),
  );

  serve(
    {
      fetch: app.fetch,
      port: 4232,
    },
    info => console.log("Listening on port", info.port, "🚀"),
  );
}

const presence = new WealthyPresence({
  appId: "",
  presets: [{ title: "test1" }, { title: "test2" }],
});

withWeb(presence);

// presence.run();
