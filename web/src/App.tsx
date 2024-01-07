import { Button } from "./components/ui/button";
import { PlayIcon, X } from "lucide-react";
import { Queue } from "./features/queue/components/Queue";
import { useMutateStatus, useStatus } from "~/lib/react-query";
import Presets from "./features/preset/components/Presets";
import { useMutateQueue } from "./features/queue/hooks/useMutateQueue";

function App() {
  const { data: status } = useStatus();

  const { mutate: changeStatus, isPending } = useMutateStatus();
  const { mutate: mutateQueue } = useMutateQueue();

  return (
    <>
      <div className="container mx-auto">
        <h1 className="text-center text-lg font-bold">
          Wealthy Presence <span className="text-blue-400">UI</span>
        </h1>

        <Button
          size="icon"
          variant={status?.isRunning ? "destructive" : "default"}
          onClick={() => {
            changeStatus(status?.isRunning ? "stop" : "run");
          }}
        >
          {status?.isRunning ? <X /> : <PlayIcon />}
        </Button>

        <h2 className="text-zinc-500">
          Status{" "}
          {status?.isRunning ? (
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

        <Presets />
      </div>
    </>
  );
}

export default App;
