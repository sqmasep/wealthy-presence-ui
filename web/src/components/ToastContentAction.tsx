import Dot from "./Dot";

interface ToastContentActionProps {
  text: string;
}

export default function ToastContentAction({
  text,
  type,
}: ToastContentActionProps &
  Pick<React.ComponentPropsWithoutRef<typeof Dot>, "type">) {
  return (
    <>
      <Dot type={type} />
      <span className="ml-1">{text}</span>
    </>
  );
}
