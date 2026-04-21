import { Text } from "@chakra-ui/react";
import { HashTag } from "@/share/atoms/tag";

function PreviewContent({ title, tags, children }: any) {
  return (
    <>
      <Text>{title}</Text>
      <div dangerouslySetInnerHTML={{ __html: children }} />
      {tags.map((item: any) => (
        <HashTag value={item.value || ""} />
      ))}
    </>
  );
}

export default PreviewContent;
