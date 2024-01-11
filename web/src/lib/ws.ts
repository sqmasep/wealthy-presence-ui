export const ws = new WebSocket("ws://localhost:4233");

ws.addEventListener("open", () => console.log("open!"));
