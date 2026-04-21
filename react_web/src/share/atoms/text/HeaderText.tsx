import { Text } from "@chakra-ui/react";
import { IText } from "./index.interface";

function HeaderText({ children }: IText) {
  return <Text variant={"header"}>{children}</Text>;
}

export default HeaderText;
