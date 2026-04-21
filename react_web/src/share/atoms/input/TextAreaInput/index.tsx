import { Textarea } from "@chakra-ui/react";
import { IProps } from "./index.interface";

function TextAreaInput({ value, onChange, placeholder, name, id }: IProps) {
  return (
    <Textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      name={name}
      id={id}
      border={"1px solid"}
      borderColor={"contrast"}
      maxLength={100}
    />
  );
}

export default TextAreaInput;
