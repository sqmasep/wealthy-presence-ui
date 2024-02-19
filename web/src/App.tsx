import { Button } from "./components/ui/button";
import { ListVideo, Play, PlayIcon, Plus, RefreshCw, X } from "lucide-react";
import { Queue } from "./features/queue/components/Queue";
import { useMutateStatus, useStatus } from "~/lib/react-query";
import Presets from "./features/preset/components/Presets";
import { useAddToQueueById } from "./features/queue/hooks/useAddToQueueById";
import { ws } from "./lib/ws";
import { useLists } from "./features/lists/hooks/useLists";
import PresetCard from "./features/preset/components/PresetCard";
import usePlayList from "./features/lists/hooks/usePlayList";
import { useQueue } from "./features/queue/hooks/useQueue";
import { useSetQueueIndex } from "./features/queue/hooks/useSetQueueIndex";
import { useState } from "react";

function App() {
  const { data: isRunning } = useStatus();

  const { mutate: changeStatus, isPending } = useMutateStatus();
  const { mutate: mutateQueue } = useAddToQueueById();
  const { data: queue } = useQueue();
  const { mutate: setQueueIndex } = useSetQueueIndex();

  const { data: lists } = useLists();
  const { mutate: playList } = usePlayList();

  return (
    <div className="flex">
      <aside className="w-[15vw] border-r border-zinc-900 p-2">
        <h1 className="text-lg font-bold">Wealthy Presence UI</h1>
        <h2 className="inline-flex items-center gap-2">
          Lists
          <ListVideo size={12} />
        </h2>
        <div className="flex flex-col gap-1 rounded-lg border border-dashed border-zinc-900 p-1">
          {lists?.map(list => (
            <button
              onClick={() => {
                playList(list.id);
              }}
              className="flex items-center justify-between rounded-md p-0.5 text-left hover:bg-zinc-900 active:scale-[0.98]"
            >
              <span>{list.name}</span>
              <Play size={12} />
            </button>
          ))}
        </div>

        <h2 className="inline-flex items-center gap-2">
          Queue
          <RefreshCw size={12} />
        </h2>
        <div className="flex flex-col gap-1 rounded-lg border border-dashed border-zinc-900 p-1">
          {queue?.map((preset, index) => (
            <button
              key={preset.id}
              onClick={() => {
                setQueueIndex(index);
              }}
              className="text-left"
            >
              <span>{preset.value.title}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="container mx-auto">
        <h1 className="text-center text-lg font-bold">
          Wealthy Presence <span className="text-blue-400">UI</span>
        </h1>

        <Button
          size="icon"
          variant={isRunning ? "destructive" : "default"}
          onClick={() => {
            changeStatus(isRunning ? "stop" : "start");
          }}
        >
          {isRunning ? <X /> : <PlayIcon />}
        </Button>

        <h2 className="text-zinc-500">
          Status{" "}
          {isRunning ? (
            <span className="inline-flex items-center gap-2 font-bold text-zinc-50">
              Running
              <span className="h-3 w-3 animate-pulse rounded-full bg-red-800" />
            </span>
          ) : (
            <span>Stopped</span>
          )}
        </h2>

        <Queue />

        <h3 className="mb-4 mt-8 text-3xl font-semibold">Presets</h3>

        {/* <Presets /> */}

        <div className="flex flex-col gap-12">
          {lists?.map(list => (
            <div
              key={list.id}
              className="group rounded-lg border border-dashed border-zinc-900 p-4 hover:bg-zinc-900/10"
            >
              <button
                onClick={() => {
                  playList(list.id);
                }}
                className="inline-flex items-center gap-2 rounded-md p-2 transition-colors group-hover:bg-zinc-800"
              >
                <h2 className="text-3xl font-bold">{list.name}</h2>
                <PlayIcon className="scale-50 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100" />
              </button>

              <div className="mt-2 grid grid-cols-4 gap-4">
                {list.presets.map(preset => (
                  <PresetCard
                    type={preset.type}
                    key={preset.id}
                    id={preset.id}
                    largeImageUrl={preset.value?.largeImageUrl}
                    smallImageUrl={preset.value?.smallImageUrl}
                    title={preset.value?.title}
                    description={preset.value?.description}
                    buttons={preset.value?.buttons}
                  />
                ))}
                <button className="grid place-content-center rounded-lg border-2 border-dashed border-zinc-900 text-zinc-500 transition-all hover:border-zinc-800 hover:bg-zinc-900 active:scale-95">
                  <Plus />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
