import { useState } from "react";
import {
  Input as ChakraInput,
  InputGroup,
  InputRightElement
} from "@chakra-ui/react";
import Button from "../../button/Button";
import { IInput } from "./index.interface";
import { ICONS } from "@/helper/icons";

function PasswordInput({
  value,
  onChange,
  placeholder,
  name,
  id,
  variant = "primary",
  isDisabled
}: IInput) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <InputGroup>
        <ChakraInput
          variant={variant}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          name={name}
          id={id}
          isDisabled={isDisabled}
        />
        <InputRightElement>
          <Button
            variant="icon"
            onClick={() => setShowPassword((prev) => !prev)}
            isDisabled={isDisabled}
          >
            {showPassword ? <ICONS.EyeClose /> : <ICONS.EyeOpen />}
          </Button>
        </InputRightElement>
      </InputGroup>
    </>
  );
}

export default PasswordInput;
