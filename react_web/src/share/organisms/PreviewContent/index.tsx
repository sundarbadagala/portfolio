import { Text } from "@chakra-ui/react";

function PreviewContent({ title, children }: any) {
  return (
    <>
      <Text>{title}</Text>
      <div dangerouslySetInnerHTML={{ __html: children }} />
      {/* {tags.map((item: any) => (
        <HashTag value={item.value || ""} />
      ))} */}
    </>
  );
}

export default PreviewContent;
