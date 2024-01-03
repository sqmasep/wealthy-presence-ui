import React, { useState } from "react";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Pencil, Plus, Trash } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useToggle } from "~/hooks/useToggle";

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

  function handleSet() {
    fetch("http://localhost:4232/set-preset", {
      method: "post",
      body: JSON.stringify(form),
    });
  }

  function handleDelete() {
    fetch("http://localhost:4232/delete-preset", {
      method: "delete",
      body: JSON.stringify({ id }),
    });
  }

  return (
    <div
      {...props}
      className={cn("p-4 rounded-lg border border-zinc-900", props.className)}
    >
      <div className="relative w-1/2 aspect-square">
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
            className="absolute w-1/3 aspect-square shadow-2xl shadow-black bottom-0 right-0 object-cover object-center rounded-full"
          />
        )}
      </div>

      {/* Edit */}
      <Button
        variant="outline"
        size="icon"
        className="px-6 py-1 text-white"
        shape="rounded"
        onClick={toggleShouldEdit}
      >
        <Pencil size={16} />
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
            <DialogDescription>This action is irreversible</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="ghost">Cancel</Button>
            <Button variant="destructive" onClick={() => onDelete()}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col">
        {title && <span className="font-bold">{title}</span>}
        {description && <span className="text-zinc-500">{description}</span>}
      </div>

      {buttons?.length && (
        <div className="flex flex-col gap-2 my-4">
          {buttons?.map(({ label, url }) => (
            <Button key={label} variant="secondary" size="sm">
              {label}
            </Button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={handleSet}>
          Set
        </Button>

        <Button variant="outline" className="grow">
          <Plus size={16} />
          Add to queue
        </Button>
      </div>
    </div>
  );
};

export default PresetCard;
