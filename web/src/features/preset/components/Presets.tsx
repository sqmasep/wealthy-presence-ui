import { usePresets } from "../hooks/usePresets";
import PresetCard from "./PresetCard";

export default function Presets() {
  const { data: presets } = usePresets();

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {presets?.presets?.map(({ id, value, type }) => (
        <PresetCard
          key={id}
          id={id}
          type={type === "function" ? "function-like" : "object-like"}
          title={value?.title}
          description={value?.description}
          buttons={value?.buttons}
          largeImageUrl={value?.largeImageUrl}
          smallImageUrl={value?.smallImageUrl}
          onDelete={async () => {
            const res = await fetch("http://localhost:4232/delete-preset", {
              method: "delete",
              body: JSON.stringify({ id }),
            }).then(r => r.json());
            console.log(res);
            // setPresets(res);
          }}
          // largeImageUrl="https://media0.giphy.com/media/8vRvucL4OhyjyM4A8T/giphy.gif"
        />
      ))}
    </div>
  );
}
