import { useAppSelector } from "@/hooks";

function BlogsList() {
  const { data } = useAppSelector((state) => state.blogs);
  console.log("---", data);

  return <div>BlogsList</div>;
}

export default BlogsList;
