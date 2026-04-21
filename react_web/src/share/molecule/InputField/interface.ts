import { ChangeEvent } from "react";

export interface IInputField {
  type?: "text" | "password" | "textarea";
  label?: string;
  id: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
}
