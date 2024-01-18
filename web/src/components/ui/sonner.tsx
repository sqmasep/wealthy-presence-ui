import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
import ToastContentAction from "../ToastContentAction";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export const presetToast = (text: string) =>
  toast(<ToastContentAction text={text} type="preset" />);

export const queueToast = (text: string) =>
  toast(<ToastContentAction text={text} type="queue" />);

export const listToast = (text: string) =>
  toast(<ToastContentAction text={text} type="lists" />);

export { Toaster };
