import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { PlayIcon, X } from "lucide-react";
import PresetCard from "./components/PresetCard";

function App() {
  const [presets, setPresets] = useState<unknown[] | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:4232/presets").then((r) =>
        r.json(),
      );

      setPresets(res);
    })();
  }, []);

  async function handleRun() {
    const res = await fetch("http://localhost:4232/run", {
      method: "post",
    }).then((r) => r.json());

    if (res?.message) {
      alert(res?.message);
    }
  }

  return (
    <>
      <div className="container mx-auto">
        <h1 className="font-bold text-lg text-center">
          Wealthy Presence <span className="text-blue-400">UI</span>
        </h1>
        <Button size="icon" onClick={handleRun}>
          <PlayIcon />
        </Button>

        {/* <Button size="icon" variant="destructive">
        <X />
      </Button> */}

        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {presets?.map(({ id, value }) => (
            <PresetCard
              key={id}
              id={id}
              type="object-like"
              title={value?.title}
              description={value?.description}
              buttons={value?.buttons}
              largeImageUrl={value?.largeImageUrl}
              smallImageUrl={value?.smallImageUrl}
              onDelete={async () => {
                const res = await fetch("http://localhost:4232/delete-preset", {
                  method: "delete",
                  body: JSON.stringify({ id }),
                }).then((r) => r.json());
                console.log(res);
                setPresets(res);
              }}
              // largeImageUrl="https://media0.giphy.com/media/8vRvucL4OhyjyM4A8T/giphy.gif"
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
