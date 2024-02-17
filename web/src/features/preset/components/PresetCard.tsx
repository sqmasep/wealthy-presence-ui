import React, { useState } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Pencil, Plus, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { useToggle } from "~/hooks/useToggle";
import { useSetPreset } from "../hooks/useSetPreset";
import { useAddToQueueById } from "~/features/queue/hooks/useAddToQueueById";
import { useQueue } from "~/features/queue/hooks/useQueue";

type PresetCardProps = {
  type?: "object-like" | "function-like";

  id: string;
  title?: string;
  description?: string;
  largeImageUrl?: string;
  largeImageText?: string;
  smallImageUrl?: string;
  smallImageText?: string;

  onDelete?: (data: unknown) => void;

  buttons?: { label: string; url: string }[];
} & (
  | {
      type: "object-like";
    }
  | {
      type: "function-like";
      async?: boolean;
    }
);

const PresetCard: React.FC<
  PresetCardProps &
    Omit<React.ComponentPropsWithoutRef<"div">, keyof PresetCardProps>
> = ({
  id,
  type,
  title,
  description,
  largeImageUrl,
  largeImageText,
  smallImageUrl,
  smallImageText,
  buttons,
  onDelete,
  ...props
}) => {
  const [shouldEdit, toggleShouldEdit] = useToggle(false);

  const [form, setForm] = useState({
    title,
    description,
    largeImageUrl,
    largeImageText,
    smallImageUrl,
    smallImageText,
    buttons,
  });

  const { mutate: setPreset } = useSetPreset();
  const { data: queue } = useQueue();
  const { mutate: addToQueue } = useAddToQueueById();

  return (
    <div
      {...props}
      className={cn(
        "flex flex-col items-start rounded-lg border border-zinc-900 bg-zinc-900/10 p-4 transition-transform duration-75 hover:scale-[1.02]",
        props.className
        // "border-blue-700 bg-blue-950/40"
      )}
    >
      <div className="flex w-full items-start justify-between">
        {(largeImageUrl || smallImageUrl) && (
          <div className="relative aspect-square w-1/2">
            {largeImageUrl && (
              <img
                src={largeImageUrl}
                alt={largeImageText}
                className="absolute inset-0 aspect-square object-cover object-center"
              />
            )}

            {smallImageUrl && (
              <img
                src={smallImageUrl}
                alt={largeImageText}
                className="absolute bottom-0 right-0 aspect-square w-1/3 rounded-full object-cover object-center shadow-2xl shadow-black"
              />
            )}
          </div>
        )}

        <div className="ml-auto flex items-center gap-1">
          {/* Edit */}
          <Button
            variant="outline"
            size="icon"
            className="flex px-6 py-1 text-white"
            shape="rounded"
            onClick={toggleShouldEdit}
          >
            <Pencil />
          </Button>
          {/* <Dialog>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit "{title}"</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <div>
              <Label>Title</Label>
              <Input value={form.title} />
            </div>

            <div>
              <Label>Description</Label>
              <Input value={form.description} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Large image URL</Label>
                <Input value={form.largeImageUrl} />
              </div>

              <div>
                <Label>Large image text</Label>
                <Input value={form.largeImageText} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Small image URL</Label>
                <Input value={form.smallImageUrl} />
              </div>

              <div>
                <Label>Small image text</Label>
                <Input value={form.smallImageText} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

          {/* Delete */}
          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon" variant="destructive" shape="rounded">
                <Trash size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete "{title}"?</DialogTitle>
                <DialogDescription>
                  This action is irreversible
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <Button variant="ghost">Cancel</Button>
                <Button variant="destructive" onClick={() => onDelete()}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Badge
        variant="outline"
        className="my-1"
        color={type === "object-like" ? "object" : "function"}
      >
        {type === "object-like" ? "Static" : "Function"}
      </Badge>

      <div className="flex flex-col">
        {title && <span className="font-bold">{title}</span>}
        {description && <span className="text-zinc-500">{description}</span>}
      </div>

      {buttons?.length && (
        <div className="my-4 flex w-full flex-col gap-2">
          {buttons?.map(({ label }) => (
            <Button key={label} variant="secondary" size="sm">
              {label}
            </Button>
          ))}
        </div>
      )}

      <div className="mt- mt-auto flex w-full items-center gap-2">
        <Button
          shape="rounded"
          variant="ghost"
          onClick={() => {
            if (queue?.length === 1 && queue?.[0]?.id === id) return;
            setPreset(id);
          }}
        >
          Set
        </Button>

        <Button
          shape="rounded"
          variant="outline"
          className="grow"
          onClick={() => {
            if (queue?.some(d => d.id === id)) return;
            addToQueue(id);
          }}
        >
          <Plus size={16} />
          Add to queue
        </Button>
      </div>
    </div>
  );
};

export default PresetCard;
