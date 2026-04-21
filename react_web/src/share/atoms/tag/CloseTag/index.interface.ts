import { ComponentWithAs, IconProps } from "@chakra-ui/react";

export interface IProps {
  value: string;
  size?: "sm" | "md" | "lg";
  icon?: ComponentWithAs<"svg", IconProps>;
  onClick?: () => void;
  style?: object;
}
