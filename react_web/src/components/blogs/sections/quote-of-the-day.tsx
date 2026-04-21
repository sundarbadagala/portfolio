import { Button, Text } from "@chakra-ui/react";
import { HeaderText } from "@/share/atoms/text";

function QuoteOfTheDay() {
  return (
    <div>
      <HeaderText>Quote of the day</HeaderText>
      <Text>“First make it work, then make it right, then make it fast.”</Text>
      <Button variant={'secondary'} size={'blockSm'}>View More</Button>
    </div>
  );
}

export default QuoteOfTheDay;
