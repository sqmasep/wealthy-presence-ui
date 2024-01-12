import { useEffect } from "react";
import { ws } from "~/lib/ws";

export function useEvent(
  eventName: "preset changed",
  cb: (data: unknown) => void
) {
  useEffect(() => {
    const internalCb = (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      if (data.event === eventName) cb(data.data);
    };
    ws.addEventListener("message", internalCb);
    return () => {
      ws.removeEventListener("message", internalCb);
    };
  }, []);
}
