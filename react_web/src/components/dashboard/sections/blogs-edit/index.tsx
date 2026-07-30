import { useEffect, useState } from "react";
import { Box, Button, Flex, HStack } from "@chakra-ui/react";
import { TextInput } from "@/share/atoms/input";
import { useCustomToast } from "@/hooks";
import { MultiSelect } from "chakra-multiselect";
import CustomEditor from "@/share/organisms/Editor";
import Wrapper from "@/share/organisms/Wrapper";
import InputField from "@/share/molecule/InputField";
import { useBottomSheet } from "@/utils/context/BottomSheet";
import PreviewContent from "@/share/organisms/PreviewContent";
import { useNavigate, useSearchParams } from "react-router-dom";
import { blogsService } from "../../service";

function App() {
  const toast = useCustomToast();
  const [params] = useSearchParams();
  const content_id = params.get('content_id')
  const navigate = useNavigate();
  const { handleOpen } = useBottomSheet();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagOptions, setTagOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [headlines, setHeadlines] = useState<string>("");
  const [groupBy, setGroupBy] = useState("");


  useEffect(() => {
    (async () => {
      if (content_id) {
        const res = await blogsService.getBlogApi(content_id)
        if (res.status === 200) {
          const { title, content, headlines, tags, groupby } = res.data.data
          console.log(groupby)
          setTitle(title)
          setContent(content)
          setHeadlines(headlines)
          console.log(tags)
          setTagOptions(tags)
          setGroupBy(groupby)
        }
      }
    })()
  }, [content_id])

  const handleChange = (res: string) => {
    setContent(res);
  };
  const handleTagOption = (res: any) => {
    setTagOptions(res);
  };
  const handleGroupBy = (res: any) => {
    setGroupBy(res);
  };
  const handlePreview = () => {
    if (title && tagOptions && content) {
      handleOpen(
        <PreviewContent title={title} tags={tagOptions}>
          {content}
        </PreviewContent>,
      );
    } else {
      toast.error("Check all fields are filled");
    }
  };
  const handleUpload = async () => {
    try {
      const payload = {
        title,
        content,
        tags: tagOptions,
        headlines,
        groupby: groupBy,
      }
      let res
      if (content_id) {
        res = await blogsService.updateBlogApi(content_id, payload)
      } else {
        res = await blogsService.postBlogApi(payload);
      }
      if (res.status === 200) {
        toast.success("Data uploaded successfully");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <Wrapper>
      <Flex direction={"column"} gap={4} m={"24px 0"}>
        <Box>
          <label htmlFor="title">Title</label>
          <TextInput
            value={title}
            placeholder="title"
            onChange={(e) => setTitle(e.target.value)}
            name="title"
            id="title"
          />
        </Box>
        <Box>
          <label>Content</label>
          <CustomEditor onData={handleChange} initialValue={content} />
        </Box>
        <Box>
          <label>Headelines</label>
          <InputField
            type="textarea"
            label=""
            value={headlines}
            onChange={(e) => setHeadlines(e.target.value)}
            placeholder="max 200 characters only"
            id="headline"
          />
        </Box>

        <Box>
          <MultiSelect
            options={[]}
            value={tagOptions}
            label="Tags"
            onChange={handleTagOption}
            create
            labelProps={{ fontWeight: "medium", fontSize: "sm", mb: 1 }}
            controlProps={{ border: "1px solid" }}
            listProps={{ borderRadius: "md", boxShadow: "md", zIndex: 10 }}
            selectedListProps={{ gap: 1 }}
          />
        </Box>
        <Box>
          <MultiSelect
            options={[]}
            value={groupBy}
            label="Group by"
            onChange={handleGroupBy}
            create
            single
            labelProps={{ fontWeight: "medium", fontSize: "sm", mb: 1 }}
            controlProps={{ border: "1px solid" }}
            listProps={{ borderRadius: "md", boxShadow: "md", zIndex: 10 }}
          />
        </Box>
      </Flex>
      <HStack gap={3}>
        <Button variant={"primary"} onClick={handlePreview}>
          PREVIEW
        </Button>
        <Button variant={"secondary"} onClick={handleUpload}>
          UPLOAD
        </Button>
        <Button variant={"secondary"}>DRAFT</Button>
        <Button variant={"error"} onClick={handleLogout}>
          Logout
        </Button>
      </HStack>
    </Wrapper>
  );
}

export default App;
