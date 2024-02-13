import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import type { AnyPreset, EventName } from "wealthy-presence";
import { WealthyPresence, createList, createPreset } from "wealthy-presence";
import { cors } from "hono/cors";
import { WebSocketServer } from "ws";
import presetRouterBuilder from "./routes/preset";
import queueRouterBuilder from "./routes/queue";
import statusRouterBuilder from "./routes/status";
import listsRouterBuilder from "./routes/lists";
import { activityRouterBuilder } from "./routes/activity";

interface WealthyPresenceUIConfig {
  port?: number;
  storage?: string;
}

function withWeb(presence: WealthyPresence, config?: WealthyPresenceUIConfig) {
  const wss = new WebSocketServer({
    port: 4233,
  });

  wss.addListener("connection", ws => {
    function emit(event: EventName, data: unknown) {
      ws.send(JSON.stringify({ event, data }));
    }

    const listener = (preset: AnyPreset) => {
      emit("activity changed", preset);
    };

    presence.on("activity changed", listener);
    ws.on("close", () => {
      console.log("connection closed");
      presence.removeListener("activity changed", listener);
    });
  });

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
    .route("/queue", queueRouterBuilder(presence))
    .route("/preset", presetRouterBuilder(presence))
    .route("/lists", listsRouterBuilder(presence))
    .route("/status", statusRouterBuilder(presence))
    .route("/activity", activityRouterBuilder(presence));

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
  lists: [
    createList("first list", [
      createPreset({
        title: "e s k i u.",
        description: "hello there!",

        largeImageUrl:
          "https://media0.giphy.com/media/8vRvucL4OhyjyM4A8T/giphy.gif",
        smallImageUrl:
          "https://m.media-amazon.com/images/I/51kMZcurWgL._UXNaN_FMjpg_QL85_.jpg",

        buttons: [
          {
            label: "📇　GitHub　⇒",
            url: "https://github.com/sqmasep",
          },
        ],
      }),
      createPreset(async () => {
        const res = await fetch("http://localhost:4222/atoms/random");
        const data = await res.json();

        return {
          title: `Atom ${data.atomicNumber}/118`,
          description: `${data.name.en} (${data.symbol}), ${data.phaseAtSTP}`,
          largeImageUrl: `https://images-of-elements.com/${data.name.en.toLowerCase()}.jpg`,
          smallImageUrl:
            "https://cdn-blog.adafruit.com/uploads/2020/08/tumblr_c033a9e8d94d0f9bb443879be3bdf97a_be998c70_1280.gif",
        };
      }),
    ]),

    createList("second list", [
      createPreset({ title: "test1", description: "test1" }),
      createPreset({ title: "test2", description: "test2" }),
      createPreset({ title: "test3", description: "test3" }),
    ]),

    createList("Utils", [
      createPreset(() => {
        const bool = Math.random() > 0.5;
        return {
          title: "1/2 chance",
          description: bool ? "true" : "false",
        };
      }),
    ]),
  ],
});

withWeb(presence);
