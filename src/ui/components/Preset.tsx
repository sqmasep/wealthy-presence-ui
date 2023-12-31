import type { FC } from "hono/jsx";
// import type { Preset } from "../../../../wealthy-presence/src/lib/validation/preset";
import { EditIcon } from "../icons/EditIcon";
import { TrashIcon } from "../icons/TrashIcon";
import { PlusIcon } from "../icons/PlusIcon";

export interface Preset {
  title: string;
  description: string;

  largeImageUrl: string;
  largeImageText: string;

  smallImageUrl: string;
  smallImageText: string;

  buttons: [
    {
      label: string;
      url: string;
    },
  ];
}

export const PresetF: FC<Partial<Preset>> = ({
  title,
  description,
  buttons,
  largeImageUrl,
  smallImageUrl,
}) => {
  return (
    <div class="p-4 border border-zinc-800 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-500">
      {/* Discord images */}
      {largeImageUrl !== undefined && smallImageUrl !== undefined && (
        <div class="relative w-1/6 aspect-square mb-2 mr-2">
          <img
            src={largeImageUrl}
            alt=""
            class="object-cover absolute w-full h-full rounded-lg"
          />
          <img
            src={smallImageUrl}
            alt=""
            class="absolute w-1/2 aspect-square object-cover rounded-full -bottom-1 -right-1"
          />
        </div>
      )}

      <div class="flex items-center gap-2">
        <button class="border-zinc-800 border rounded-full py-1.5 px-3.5">
          <EditIcon />
        </button>
        <button class="text-red-400 border-red-400 border rounded-full py-1.5 px-3.5">
          <TrashIcon />
        </button>
      </div>

      {/* Discord title & description */}
      <p class="font-bold text-xl">{title}</p>
      <p>{description}</p>

      {/* Discord buttons */}
      <div class="flex flex-col">
        {buttons?.map(button => (
          <button class="bg-zinc-500">{button.label}</button>
        ))}
      </div>

      {/* Actions */}
      <div class="flex items-center justify-between gap-2">
        <button
          hx-post="/set-presets"
          class="flex items-center gap-1 px-3.5 py-1.5 rounded-full border border-white"
        >
          Set
          <PlusIcon />
        </button>
        <button
          hx-post="/add-to-queue"
          class="rounded-full grow px-3.5 py-1.5 flex items-center justify-center border border-emerald-700 text-emerald-700 gap-1"
        >
          Add to queue
          <PlusIcon />
        </button>
      </div>
    </div>
  );
};
