import { useId } from "react";
import { Text } from "@chakra-ui/react";
import { TextInput, PasswordInput, TextAreaInput } from "@/share/atoms/input";
import { IInputField } from "./interface";

function InputField({
  type = "text",
  label,
  id,
  placeholder,
  value,
  onChange,
  error
}: IInputField) {
  const customId = useId();
  const Config = {
    text: TextInput,
    password: PasswordInput,
    textarea: TextAreaInput
  };
  const Element = Config[type];
  return (
    <>
      <Text as={"label"} variant={"label"} htmlFor={id + customId}>
        {label}
      </Text>
      <Element
        value={value}
        onChange={onChange}
        id={id + customId}
        name={id}
        placeholder={placeholder}
      />
      {error && <Text variant={"error"}>{error}</Text>}
    </>
  );
}

export default InputField;
