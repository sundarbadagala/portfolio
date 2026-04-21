import { Tag as ChakraTag, TagLabel, TagLeftIcon } from "@chakra-ui/react";
import { IProps } from "./index.interface";
import { getRandomColor } from "../../../../helper/methods";
import { ICONS } from "@/helper/icons";

function TagItem({ value, size = "md", onClick, style }: IProps) {
  return (
    <>
      <ChakraTag
        size={size}
        variant="subtle"
        backgroundColor={getRandomColor()}
        style={style}
        onClick={() => (onClick ? onClick(value) : null)}
        fontWeight={"bold"}
        cursor={"pointer"}
        data-testid="hash-tag"
      >
        <TagLeftIcon as={ICONS.Hash} />
        <TagLabel fontSize={"14px"} display={"flex"} alignItems={"center"}>
          {value}
        </TagLabel>
      </ChakraTag>
    </>
  );
}

export default TagItem;
