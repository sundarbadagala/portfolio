import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";

function ActionInput({
  onAction,
  placeholder,
}: {
  onAction: (arg1: string) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");
  const handleAction = () => {
    onAction(value);
    setValue("");
  };
  return (
    <>
      <InputGroup size="md" width={"150px"} display={"inline-block"}>
        <Input
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <InputRightElement>
          <Button h="1.75rem" size="sm" onClick={handleAction}>
            +
          </Button>
        </InputRightElement>
      </InputGroup>
    </>
  );
}

export default ActionInput;
