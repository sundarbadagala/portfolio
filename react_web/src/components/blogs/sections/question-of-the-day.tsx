import { HeaderText } from "@/share/atoms/text";
import { dummy_question } from "@/helper/dummy";
import { Button, Flex } from "@chakra-ui/react";
import SingleSelect from "@/share/molecule/Question/SingleSelect";

function QuestionOfTheDay() {
  const { question, options } = dummy_question;
  const handleChange = (value: any) => {
    console.log(value);
  };
  return (
    <>
      <HeaderText>Question Of The Day</HeaderText>
      <SingleSelect
        handleChange={handleChange}
        question={question}
        options={options}
      />
      <Flex gap={"8px"}>
        <Button variant={"primary"} size={"blockSm"}>
          Submit
        </Button>
        <Button variant={"secondary"} size={"blockSm"}>
          View More
        </Button>
      </Flex>
    </>
  );
}

export default QuestionOfTheDay;
