import { Box, Text, VStack } from "@chakra-ui/react";
import { HashTag } from "@/share/atoms/tag";
import { getDate } from "@/helper/methods";
import '@/styles/hljs.css'

function PreviewContent({ title, children, tags }: any) {
  return (
    <>
      <VStack gap={'12px'} justifyContent={'flex-start'} alignItems={'flex-start'}>
        <Text fontSize={"24px"} fontWeight={"bold"}>
          {title}
        </Text>
        <Box>{getDate(new Date())}</Box>
        <Box>
          {tags.map((item: any) => (
            <HashTag value={item.value || ""} />
          ))}
        </Box>
      </VStack>
      <Box style={{ margin: "24px 0" }}>
        <hr />
      </Box>
      <Box
        sx={{
          "h1, h2, h3, h4, h5, h6, ul, ol, li, p, blockquote, code": {
            all: "revert",
          },
          "prev": {
            width: "100%"
          }

        }}
        dangerouslySetInnerHTML={{ __html: children }}
      />
    </>
  );
}

export default PreviewContent;
