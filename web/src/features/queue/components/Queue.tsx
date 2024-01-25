import { useEvent } from "~/hooks/useEvent";
import { useQueue } from "../hooks/useQueue";
import QueueItem from "./QueueItem";
import { useEffect, useState } from "react";
import { Reorder } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useSetQueue } from "../hooks/useSetQueue";

export function Queue() {
  const { data: queue } = useQueue();
  const [currentPresetId, setCurrentPresetId] = useState<string | null>(null);
  const [reorderQueue, setReorderQueue] = useState(queue);
  const utils = useQueryClient();

  const { mutate: setQueue } = useSetQueue();

  useEvent("activity changed", data => {
    setCurrentPresetId(data.id);
  });

  // annoying unavoidable hack
  useEffect(() => {
    setReorderQueue(queue);
  }, [queue]);

  useEffect(() => {
    const ids = reorderQueue?.map(p => p.id);
    console.log(ids);
    setQueue(ids ?? []);
    // utils.invalidateQueries({ queryKey: ["queue", "get"] });
  }, [reorderQueue, utils, setQueue]);

  return (
    <div className="rounded-xl border border-dashed border-zinc-900 p-2">
      {reorderQueue?.length && (
        <Reorder.Group values={reorderQueue} onReorder={setReorderQueue}>
          {reorderQueue?.map((preset, index) => (
            <Reorder.Item key={preset.id} value={preset}>
              <QueueItem
                isActive={currentPresetId === preset.id}
                index={index}
                key={preset.id}
                id={preset.id}
                title={preset.value?.title}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </div>
  );
}
