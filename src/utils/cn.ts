import type { CnOptions } from "tailwind-variants";
import { cn as tvCn } from "tailwind-variants";

export const cn = (...classes: CnOptions) =>
  tvCn(...classes)({ twMerge: true });
