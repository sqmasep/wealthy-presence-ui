import type { FC } from "hono/jsx";
import type { PresetShape } from "./components/Preset";
import { Preset } from "./components/Preset";
import { Button } from "./components/Button";
import { PlayIcon } from "./icons/PlayIcon";

export const Layout: FC<{
  presets: PresetShape[];
}> = ({ presets }) => (
  <html>
    <head>
      <title>hey</title>
      <link rel="stylesheet" href="/static/css/output.css" />
      <script src="https://unpkg.com/htmx.org@1.9.10" defer></script>
    </head>

    <body class="bg-zinc-950 text-zinc-300">
      <div class="">
        <h1 class="font-bold">
          Wealthy Presence <span class="text-blue-500">UI</span>
          <div class="w-4 h-4 animate-pulse rounded-full bg-red-600"></div>
        </h1>
        <p>epic</p>

        <div class="flex items-center gap-2">
          <Button variant="primary" hx-post="/run" hx-swap="outerHTML">
            Play <PlayIcon />
          </Button>
        </div>

        <div class="grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {presets.map(async preset => (
            <Preset isQueued={true} {...preset} />
          ))}
        </div>
      </div>
    </body>
  </html>
);
