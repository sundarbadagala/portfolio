import { useEffect } from "react";
import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import hljs from "highlight.js";
import { getDate } from "@/helper/methods";
import "./styles.css";
import { IBlogCardProps } from "@/components/blogs/interface";

function BlogCard({
  title,
  tags,
  date,
  highlight,
  headlines,
  content_id,
  slug,
  onClick
}: IBlogCardProps extends {onclick: (arg1: string, arg2: string) => void} ? IBlogCardProps : any) {
  useEffect(() => {
    const queris: any = document.getElementsByTagName("pre");
    Object.keys(queris).forEach((item) => hljs.highlightBlock(queris[item]));
  }, []);
  console.log("a.a.a.hi", highlight);

  const cardBg = "bg";
  const outerShadow = useColorModeValue(
    "8px 8px 16px #c9c7c8, -8px -8px 16px #ffffff",
    "8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.08)"
  );
  const innerShadow = useColorModeValue(
    "inset 6px 6px 12px #c9c7c8, inset -6px -6px 12px #ffffff",
    "inset 6px 6px 12px rgba(0, 0, 0, 0.5), inset -6px -6px 12px rgba(255, 255, 255, 0.08)"
  );

  return (
    <Box
      bg={cardBg}
      borderRadius={"2xl"}
      boxShadow={outerShadow}
      p={"16px"}
      transition="all 0.3s ease-in-out"
      onClick={() => onClick(content_id, slug)}
      _hover={{
        cursor: "pointer",
        boxShadow: innerShadow,
        transform: "translateY(-4px)"
      }}
    >
      <Flex justify={"space-between"}>
        <Text fontSize={"24px"} fontWeight={"medium"}>
          {title}
        </Text>
        <Text fontSize={"12px"}>{getDate(date)}</Text>
      </Flex>
      <Text fontSize={"16px"} p={"12px 0"}>
        {headlines}
      </Text>
      <Box display={"flex"} gap={"4px"}>
        {tags.map((item:string, index:number) => (
          <Text as={"code"} key={index}>
            #{item}
          </Text>
        ))}
      </Box>
    </Box>
  );
}

export default BlogCard;
