import type { FC } from "hono/jsx";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

const button = tv({
  base: "flex gap-1 items-center justify-center border-2 active:translate-y-0 active:scale-95 transition-all",
  variants: {
    variant: {
      primary:
        "bg-white border-zinc-400 text-black hover:bg-zinc-300 hover:border-zinc-600",
      secondary: "border-zinc-300 text-zinc-300",
      destructive:
        "bg-red-800 border-red-900 text-white hover:bg-red-900 hover:border-red-950",
      success: "",
      outline: "text-white border-zinc-600",
    },
    shape: {
      rounded: "rounded-full",
      squared: "rounded-md",
    },
    size: {
      sm: "py-1.5 px-3.5 text-sm",
      md: "py-2 px-4 text-base",
      lg: "py-2.5 px-5 text-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    shape: "rounded",
    size: "md",
  },
});

export const Button: FC<
  Hono.ButtonHTMLAttributes & VariantProps<typeof button>
> = ({ variant, shape, size, children, ...props }) => {
  return (
    <button
      {...props}
      class={button({ variant, shape, size, class: props.class })}
    >
      {children}
    </button>
  );
};
