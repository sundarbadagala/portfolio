import { Text } from "@chakra-ui/react";
import { IText } from "./index.interface";

function ErrorText({ children }: IText) {
  return <Text variant={"error"}>{children}</Text>;
}

export default ErrorText;
