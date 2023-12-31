import type { FC } from "hono/jsx";
import { tv } from "tailwind-variants";

const chip = tv({
  base: "uppercase text-xs rounded-full px-0.5 py-1 border-2 font-bold",
  variants: {
    variant: {
      success: "border-green-800 text-green-800",
    },
  },
  defaultVariants: {
    variant: "success",
  },
});

// Hono please add a way to get span attributes...
export const Chip: FC<Hono.HTMLAttributes> = ({ children, ...props }) => {
  return <span class={chip({ class: props.class })}>{children}</span>;
};
