import { Input as ChakraInput } from "@chakra-ui/react";
import { IInput } from "./index.interface";

function TextInput({
  value,
  onChange,
  placeholder,
  name,
  id,
  variant = "primary",
  isDisabled,
  ...rest
}: IInput) {
  return (
    <ChakraInput
      variant={variant}
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      name={name}
      id={id}
      data-testid="text-input"
      disabled={isDisabled}
      {...rest}
    />
  );
}

export default TextInput;
