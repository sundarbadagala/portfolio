import { INewsCardProps } from "@/components/blogs/interface";
import { getDate } from "@/helper/methods";
import { Flex, useColorModeValue, Box } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";


const NewsCard = ({ title, source, image, publishedAt, url }: INewsCardProps) => {
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
      p={"14px"}
      transition="all 0.3s ease-in-out"
      _hover={{
        boxShadow: innerShadow,
        transform: "translateY(-4px)"
      }}
    >
      <Flex gap={"12px"} align="flex-start">
        <Image 
          src={image} 
          alt="" 
          width={70} 
          height={70} 
          borderRadius={"xl"}
          objectFit="cover"
        />
        <Flex direction={"column"} justifyContent={"space-between"} flex={1}>
          <Text
            fontSize={"12px"}
            _hover={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => window.open(url, "_blank", "noopener noreferrer")}
          >
            {title}
          </Text>
          <Flex justifyContent={"space-between"}>
            <Text fontSize={"10px"} fontWeight={"bold"}>
              {source.name}
            </Text>
            <Text fontSize={"10px"} fontWeight={"bold"}>
              {getDate(publishedAt)}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default NewsCard;
