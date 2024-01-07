import { useQueue } from "../hooks/useQueue";
import QueueItem from "./QueueItem";

export function Queue() {
  const { data: queue } = useQueue();
  return (
    <div className="rounded-xl border border-zinc-700 bg-gradient-to-br from-zinc-900 p-4">
      {queue?.map(preset => (
        <QueueItem key={preset.id} title={preset.value.title} />
      ))}
    </div>
  );
}
