import type { AnyPreset } from "wealthy-presence";

export default async function parsePreset(preset: AnyPreset) {
  const type =
    typeof preset.value === "function" ? "function-like" : "object-like";

  if (typeof preset.value === "function") {
    const awaitedValue = await preset.value();
    return {
      ...preset,
      type,
      value: awaitedValue,
    };
  }
  return {
    ...preset,
    type,
  };
}
