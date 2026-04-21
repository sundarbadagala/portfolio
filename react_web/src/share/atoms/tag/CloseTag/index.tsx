import { Tag as ChakraTag, TagRightIcon, TagLabel } from "@chakra-ui/react";
import { IProps } from "./index.interface";
import { ICONS } from "@/helper/icons";

function TagItem({
  value,
  size = "md",
  icon = ICONS.Close,
  onClick,
  style,
}: IProps) {
  return (
    <>
      <ChakraTag
        colorScheme="purple"
        style={style}
        data-testid="close-tag"
        size={size}
      >
        <TagLabel fontSize={"14px"}>{value}</TagLabel>
        <TagRightIcon
          boxSize="6px"
          as={icon}
          onClick={onClick}
          cursor={"pointer"}
          data-testid="close-tag-icon"
        />
      </ChakraTag>
    </>
  );
}

export default TagItem;
