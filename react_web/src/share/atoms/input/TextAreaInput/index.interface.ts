import { ChangeEventHandler } from "react";

export interface IProps {
    value: string;
    onChange: ChangeEventHandler<HTMLTextAreaElement>;
    placeholder?: string;
    name: string;
    id: string;
    maxLength?: number;
}