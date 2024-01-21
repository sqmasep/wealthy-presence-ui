import { vValidator } from "@hono/valibot-validator";
import { array, object, string } from "valibot";

export const idValidator = vValidator(
  "json",
  object({
    id: string(),
  }),
);

export const idsValidator = vValidator(
  "json",
  object({
    ids: array(string()),
  }),
);
