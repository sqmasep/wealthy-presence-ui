import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useMutateQueue } from "../hooks/useMutateQueue";

export default function QueueItem({
  id,
  title,
}: {
  id: string;
  title?: string;
}) {
  const { mutate } = useMutateQueue();

  return (
    <div className="group relative rounded-lg hover:bg-zinc-200/5">
      <button
        className="block w-full p-1 py-4 text-left"
        onClick={() => {
          mutate(id);
        }}
      >
        {title}
      </button>
      <Button
        variant="outline"
        className="absolute right-0 top-1/2 -translate-y-1/2 px-4"
        shape="rounded"
      >
        <X />
      </Button>
    </div>
  );
}
