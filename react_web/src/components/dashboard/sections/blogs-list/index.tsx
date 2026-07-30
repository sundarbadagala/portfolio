import { useAppDispatch, useAppSelector, useCustomToast } from "@/hooks";
import { useEffect } from "react";
import { blogsRequest } from "@/components/dashboard/slice.blogs";
import { blogsService } from "@/components/dashboard/service";
import Wrapper from "@/share/organisms/Wrapper";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Button,
  Heading,
  Text,
  Spinner
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ICONS } from "@/helper/icons";

function BlogsList() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useCustomToast();
  const { data, isLoading, error } = useAppSelector((state) => state._blogs);

  useEffect(() => {
    dispatch(blogsRequest());
  }, [dispatch]);

  const handleEdit = (blog: any) => {
    navigate(`/dashboard/blogs/edit?content_id=${blog.content_id}`, { state: { blog } });
  };
  const handleView = (blog: any) => {
    navigate(`/dashboard/blogs/view?content_id=${blog.content_id}`, { state: { blog } });
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const res = await blogsService.deleteBlogApi(id);
        if (res.status === 200) {
          toast.success("Blog deleted successfully");
          dispatch(blogsRequest());
        } else {
          toast.error(res.data?.message || "Failed to delete blog");
        }
      } catch (err) {
        toast.error((err as Error).message || "An error occurred while deleting the blog");
      }
    }
  };

  return (
    <Wrapper>
      <Flex direction={"column"} gap={4} m={"24px 0"}>
        <Flex justifyContent={"space-between"}>
          <Heading size="lg" mb={4}>
            Blogs List
          </Heading>
          <Button onClick={() => navigate('/dashboard/blogs/edit')} variant="secondary">New Blog</Button>
        </Flex>

        {isLoading ? (
          <Flex justify="center" p={8}>
            <Spinner size="xl" />
          </Flex>
        ) : error ? (
          <Text color="error.500">{error}</Text>
        ) : !data || data.length === 0 ? (
          <Text>No blogs found.</Text>
        ) : (
          <TableContainer
            overflowX="auto"
            borderRadius="md"
            border="1px solid"
            borderColor="mono.700"
            sx={{
              scrollBehavior: "smooth",
              "&::-webkit-scrollbar": {
                height: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "mono.800",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "mono.600",
                borderRadius: "4px",
              },
            }}
          >
            <Table variant="simple" size="md">
              <Thead bg="mono.900">
                <Tr>
                  <Th
                    position="sticky"
                    left={0}
                    zIndex={2}
                    bg="mono.900"
                    boxShadow="2px 0 2px -1px rgba(255,255,255,0.15)"
                    color="mono.100"
                  >
                    Content ID
                  </Th>
                  <Th color="mono.100">Title</Th>
                  <Th color="mono.100">Date</Th>
                  <Th color="mono.100" textAlign="center">
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((blog: any) => (
                  <Tr key={blog.content_id} role="group" _hover={{ bg: "mono.700" }}>
                    <Td
                      position="sticky"
                      left={0}
                      zIndex={1}
                      _groupHover={{ bg: "mono.700" }}
                      boxShadow="2px 0 2px -1px rgba(255,255,255,0.15)"
                      fontWeight="bold"
                    >
                      {blog.content_id}
                    </Td>
                    <Td maxW="300px" isTruncated>
                      {blog.title}
                    </Td>
                    <Td>
                      {new Date(blog.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Td>
                    <Td>
                      <Flex gap={2} justify="center">
                        <Button
                          size="md"
                          p={0}
                          variant="primary"
                          onClick={() => handleView(blog)}
                        >
                          <ICONS.View size={'20px'} />
                        </Button>
                        <Button
                          size="md"
                          variant="secondary"
                          onClick={() => handleEdit(blog)}
                        >
                          <ICONS.Edit size={'20px'} />
                        </Button>
                        <Button
                          size="md"
                          variant="error"
                          onClick={() => handleDelete(blog.content_id)}
                        >
                          <ICONS.Delete size={'20px'} />
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Flex>
    </Wrapper>
  );
}

export default BlogsList;
