import { ButtonProps } from "@chakra-ui/react";
import { MouseEventHandler, ReactNode } from "react";

export interface IButton extends ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "icon"; 
  size?: "sm" | "md" | "lg" | 'block' | 'blockSm' | 'blockMd';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isDisabled?: boolean;
}
