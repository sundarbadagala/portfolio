import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect } from "react";
import { blogsRequest } from "@/components/dashboard/slice.blogs";
import Wrapper from "@/share/organisms/Wrapper";
import { Flex } from "@chakra-ui/react";

function BlogsList() {
  const dispatch = useAppDispatch()
  const { data } = useAppSelector((state) => state._blogs);
  console.log("---", data);
  useEffect(() => {
    dispatch(blogsRequest())
  }, [])


  return (
    <Wrapper>
      <Flex direction={"column"} gap={4} m={"24px 0"}>
        heiii
      </Flex>
    </Wrapper>
  )
}

export default BlogsList;
