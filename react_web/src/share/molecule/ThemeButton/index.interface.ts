import { MouseEventHandler, ReactNode } from "react";

export interface IButton {
  children: ReactNode;
  variant?: "primary" | "secondary" | "icon";
  size?: "sm" | "md" | "lg";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isDisabled?: boolean;
}
