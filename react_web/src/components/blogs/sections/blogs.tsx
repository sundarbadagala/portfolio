import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { blogsRequest } from "../slice.blogs";
import BlogCard from "@/share/molecule/BlogCard";
import { IBlogCardProps } from "../interface";
import { useNavigate } from "react-router-dom";
import { Flex } from "@chakra-ui/react";

function BlogsSection() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: blogs, isLoading } = useAppSelector((state) => state.blogs);
  useEffect(() => {
    dispatch(blogsRequest());
  }, []);
  const handleRoute = (content_id: string, slug: string) => {
    const slugId = `${slug}-${content_id}`;
    navigate(`/blog/${slugId}`);
  };
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  console.log("a.a.a.---", blogs);
  return (
    <>
      <Flex direction={"column"} gap={"12px"}>
        {blogs.map((item: IBlogCardProps) => (
          <BlogCard {...item} onClick={handleRoute} />
        ))}
      </Flex>
    </>
  );
}

export default BlogsSection;
