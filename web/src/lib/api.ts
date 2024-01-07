import { hc } from "hono/client";
import type { WealthyPresenceApi } from "../../../server/src/index";

export const api = hc<WealthyPresenceApi>("http://localhost:4232");
