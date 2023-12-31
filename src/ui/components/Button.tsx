import type { Child, FC } from "hono/jsx";

export const Button: FC<{ children: Child }> = ({ children }) => {
  return <button>{children}</button>;
};
