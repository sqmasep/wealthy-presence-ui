import { vValidator } from "@hono/valibot-validator";
import { object, string } from "valibot";

export const idValidator = vValidator(
  "json",
  object({
    id: string(),
  }),
);
