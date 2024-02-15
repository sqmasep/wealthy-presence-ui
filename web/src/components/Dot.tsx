import { cn } from "~/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

const dot = cva("w-2 h-2 inline-block rounded-full", {
  variants: {
    type: {
      queue: "bg-blue-500",
      preset: "bg-green-500",
      lists: "bg-yellow-500",
    },
  },
});

export default function Dot({
  type,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & VariantProps<typeof dot>) {
  return (
    <div {...props} className={dot({ type, className: props.className })} />
  );
}
