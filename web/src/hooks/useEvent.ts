import { useEffect } from "react";
import { ws } from "~/lib/ws";

type EventName = "activity changed";

export function useEvent(eventName: EventName, cb: (data: unknown) => void) {
  useEffect(() => {
    const internalCb = (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      if (data.event === eventName) cb(data.data[0]);
    };
    ws.addEventListener("message", internalCb);
    return () => {
      ws.removeEventListener("message", internalCb);
    };
  }, []);
}
