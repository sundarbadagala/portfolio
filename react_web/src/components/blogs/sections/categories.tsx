import { Button, Flex, Text } from "@chakra-ui/react";
import { HeaderText } from "@/share/atoms/text";
import { useBottomSheet } from "@/utils/context/BottomSheet";

const cats = ["React", "Javascript", "Typescript", "CSS", "HTML", "Angular"];

function CategoriesSection() {
  const { handleOpen } = useBottomSheet();
  const handleViewMore = () => {
    handleOpen(
      <>
        <h1 style={{marginBottom:'24px'}}>All Categories</h1>
        <Flex gap={"12px"}>
          {cats.map((item) => (
            <Button variant={"secondary"} size={"sm"}>
              {item}
            </Button>
          ))}
        </Flex>
      </>
    );
  };
  return (
    <div>
      <HeaderText>Categories</HeaderText>
      {cats.slice(0, 5).map((item) => (
        <Text>{item}</Text>
      ))}
      <Button variant={"secondary"} size={"blockSm"} onClick={handleViewMore}>
        View More
      </Button>
    </div>
  );
}

export default CategoriesSection;
