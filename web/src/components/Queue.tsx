import React from "react";
import { useQueue } from "~/lib/react-query";

export function Queue() {
  const { data: queue } = useQueue();
  return (
    <div className="border border-zinc-700 rounded-xl p-4 bg-gradient-to-br from-zinc-900">
      {queue?.map(preset => <div>{preset.value.title}</div>)}
    </div>
  );
}
