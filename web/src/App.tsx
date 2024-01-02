import { useEffect } from "react";
import { Button } from "./components/ui/button";

function App() {
  useEffect(() => {
    (async () => {
      await fetch("/set-preset", { method: "post" })
        .then(r => r.json())
        .then(console.log);
    })();
  }, []);

  return (
    <>
      <div className="text-red-400">testok</div>
      <h1 className="text-blue-500">now using react! how cool is that</h1>
      <h1 className="text-blue-500">htmx is limiting the app in two ways with what i wanna do</h1>

      <Button>hey</Button>
      <Button variant="destructive">hey</Button>

      <button
        onClick={() => {
          fetch("/run", { method: "post" }).then(console.log);
        }}
      >
        run!
      </button>
    </>
  );
}

export default App;
