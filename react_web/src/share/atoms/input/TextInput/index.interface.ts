import { InputProps } from "@chakra-ui/react";
import { ChangeEventHandler } from "react";

export interface IInput extends InputProps {
  variant?: 'primary' | 'error' | 'success';
  value: string | number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  name?: string;
  id?: string;
  isDisabled?: boolean;
}
