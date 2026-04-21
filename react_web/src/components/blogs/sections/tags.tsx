import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { tagsRequest } from "../slice.tags";
import { useNavigate } from "react-router-dom";
import { Flex, Code, Button } from "@chakra-ui/react";
import { useBottomSheet } from "@/utils/context/BottomSheet";
import { HeaderText } from "@/share/atoms/text";

function TagsSection() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: tags, isLoading } = useAppSelector((state) => state.tags);
  const { handleOpen, handleClose } = useBottomSheet();
  useEffect(() => {
    dispatch(tagsRequest());
  }, []);
  const handleBlogByTag = (tag: string) => {
    navigate(`/blogs?tags=${tag}`);
    handleClose();
  };
  const handleViewMore = () => {
    handleOpen(
      <>
        <h1 style={{ marginBottom: "24px" }}>All Tags</h1>
        <Flex gap={"24px"}>
          {tags.map((tagItem: string, index: number) => (
            <Code
              key={index}
              onClick={() => handleBlogByTag(tagItem)}
              background={"none"}
              _hover={{ textDecoration: "underline", cursor: "pointer" }}
            >
              #{tagItem}
            </Code>
          ))}
        </Flex>
      </>
    );
  };
  if (isLoading) {
    return <h1>loading...</h1>;
  }
  return (
    <>
      <HeaderText>Tags</HeaderText>
      <Flex direction={"column"} gap={"8px"}>
        {tags.slice(0, 5).map((tagItem: string, index: number) => (
          <Code
            key={index}
            onClick={() => handleBlogByTag(tagItem)}
            background={"none"}
            _hover={{ textDecoration: "underline", cursor: "pointer" }}
          >
            #{tagItem}
          </Code>
        ))}
      </Flex>
      <Button variant={"secondary"} onClick={handleViewMore} size={"blockSm"}>
        View More
      </Button>
    </>
  );
}

export default TagsSection;
