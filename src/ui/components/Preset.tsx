import type { FC } from "hono/jsx";
// import type { Preset } from "../../../../wealthy-presence/src/lib/validation/preset";
import { EditIcon } from "../icons/EditIcon";
import { TrashIcon } from "../icons/TrashIcon";
import { PlusIcon } from "../icons/PlusIcon";
import { Button } from "./Button";
import { Chip } from "./Chip";
import { CloseIcon } from "../icons/CloseIcon";
import { cn } from "~/utils/cn";

export interface PresetShape {
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

interface PresetProps extends Partial<PresetShape> {
  isQueued?: boolean;
}

export const Preset: FC<PresetProps & Hono.HTMLAttributes> = ({
  title,
  description,
  buttons,
  largeImageUrl,
  smallImageUrl,
  largeImageText,
  smallImageText,
  isQueued,
  ...props
}) => {
  return (
    <div
      {...props}
      class={cn(
        "p-4 border border-zinc-800 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-500",
        props.class,
      )}
    >
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
        <Button variant="outline" size="sm">
          <EditIcon />
        </Button>

        <Button variant="destructive" size="sm">
          <TrashIcon />
        </Button>
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
        {isQueued ? (
          <Button size="sm" variant="destructive" class="grow">
            Remove from queue
            <CloseIcon />
          </Button>
        ) : (
          <Button size="sm" variant="secondary" class="grow">
            Add to queue
            <PlusIcon />
          </Button>
        )}

        <Button size="sm" hx-post="/set-activity">
          Set
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
};
