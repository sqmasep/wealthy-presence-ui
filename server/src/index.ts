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

function withWeb(presence: WealthyPresence, config?: { port?: number }) {
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

  // const defaultQueue = presence.getQueue();

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
    .route("/status", statusRouterBuilder(presence));

  // .post("/presets", c => {
  //   presence.addPreset(createPreset({ title: "test" }));
  //   return c.json(presence.getPresets(), 201);
  // })
  // .post("/set-preset", idValidator, async c => {
  //   const foundPreset = defaultQueue.find(
  //     preset => preset.id === c.req.valid("json").id,
  //   );

  //   if (!foundPreset) return c.json({ message: "Preset not found" }, 404);

  //   presence.setPresets([foundPreset]);
  //   return c.json(presence.getPresets(), 200);
  // })
  // .delete("/delete-preset", async c => {
  //   // TODO validate id (maybe use "/preset/:id" instead of "/delete-preset")
  //   presence.removePreset((await c.req.json())?.id);
  //   return c.json(presence.getPresets(), 200);
  // })

  // .post("/restore-state", c => {
  //   presence.setPresets(defaultQueue);
  //   return c.json(presence.getPresets(), 200);
  // });

  // .post("/run", async c => {
  //   try {
  //     await presence.run();
  //     return c.json({ message: "Running" }, 200);
  //   } catch (error) {
  //     return c.json({ message: "Something went wrong" }, 500);
  //   }
  // })

  // .post("/stop", async c => {
  //   await presence.stop();
  //   return c.json({ message: "Stopped" }, 200);
  // })

  // .get("/is-running", c => {
  //   return c.json({ isRunning: presence.isRunning() }, 200);
  // });

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
      createPreset({ title: "test", description: "test" }),
      createPreset({ title: "test", description: "test" }),
      createPreset({ title: "test", description: "test" }),
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
