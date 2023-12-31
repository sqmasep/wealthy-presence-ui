import type { FC } from "hono/jsx";
import type { Preset } from "./components/Preset";
import { PresetF } from "./components/Preset";

export const Layout: FC<{
  presets: Preset[];
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
          Wealthy Presence <span>s</span>
        </h1>
        <p>epic</p>

        <button hx-post="/setActivity" hx-swap="outerHTML">
          Set Activity
        </button>

        <div class="grid gap-2 grid-cols-4">
          {presets.map(async preset => (
            <PresetF {...preset} />
          ))}
        </div>
      </div>
    </body>
  </html>
);
