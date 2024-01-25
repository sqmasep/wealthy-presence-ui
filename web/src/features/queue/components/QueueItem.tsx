import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useRemoveQueueItem } from "../hooks/useRemoveQueueItem";
import { cn } from "~/lib/utils";
import { useSetActivity } from "../../activity/hooks/useSetActivity";
import { useSetQueueIndex } from "../hooks/useSetQueueIndex";

export default function QueueItem({
  id,
  title,
  isActive,
  index,
}: {
  id: string;
  title?: string;
  isActive?: boolean;
  index?: number;
}) {
  const { mutate: setQueueIndex } = useSetQueueIndex();
  const { mutate: removeQueueItem } = useRemoveQueueItem();

  return (
    <div
      className={cn(
        "group relative rounded-lg hover:bg-zinc-200/5",
        isActive && "bg-zinc-900"
      )}
    >
      <button
        className="block w-full p-4 text-left"
        onClick={() => setQueueIndex(index)}
      >
        {title}
      </button>

      <Button
        variant="outline"
        className="absolute right-4 top-1/2 -translate-y-1/2"
        shape="rounded"
        onClick={() => {
          removeQueueItem(id);
        }}
      >
        <X />
      </Button>
    </div>
  );
}
