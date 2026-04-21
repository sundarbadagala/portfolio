import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { TextInput } from "@/share/atoms/input";
import { useCustomToast } from "@/hooks";
import { MultiSelect } from "chakra-multiselect";
import { CONTENT_TAGS } from "@/helper/constants";
import CustomEditor from "@/share/organisms/Editor";
import Wrapper from "@/share/organisms/Wrapper";
import InputField from "@/share/molecule/InputField";
import { useBottomSheet } from "@/utils/context/BottomSheet";
import PreviewContent from "@/share/organisms/PreviewContent";
import { apiHandler } from "@/utils/apiHandler/service";
import { POST_CONTENT } from "@/helper/endpoints";

function App() {
  const toast = useCustomToast();
  const { handleOpen } = useBottomSheet();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagOptions, setTagOptions] = useState<{ label: string, value: string }[]>([]);
  const [headlines, setHeadlines] = useState<string>("");
  const handleChange = (res: string) => {
    setContent(res);
  };
  const handleTagOption = (res: any) => {
    setTagOptions(res);
  };
  const handlePreview = () => {
    if (title && tagOptions && content) {
      handleOpen(
        <PreviewContent title={title} tags={tagOptions}>
          {content}
        </PreviewContent>
      );
    } else {
      toast.error("Check all fields are filled");
    }
  };
  const handleUpload = async () => {
    console.log(title);
    console.log(content);
    console.log(tagOptions);
    console.log(headlines);
    const res = await apiHandler.post(POST_CONTENT, {
      payload: {
        title,
        content,
        tags: tagOptions.map((item: { value: string }) => item.value),
        headlines
      }
    });
    console.log("res", res);
  };
  return (
    <Wrapper>
      <label htmlFor="title">Title</label>
      <TextInput
        value={title}
        placeholder="title"
        onChange={(e) => setTitle(e.target.value)}
        name="title"
        id="title"
      />
      <label>Content</label>
      <CustomEditor onData={handleChange} />
      <InputField
        type="textarea"
        label=""
        value={headlines}
        onChange={(e) => setHeadlines(e.target.value)}
        placeholder="max 100 characters only"
        id="headline"
      />
      <MultiSelect
        options={CONTENT_TAGS}
        value={tagOptions}
        label="Tags"
        onChange={handleTagOption}
      />
      <Button variant={"primary"} onClick={handlePreview}>
        PREVIEW
      </Button>
      <Button variant={"secondary"} onClick={handleUpload}>
        UPLOAD
      </Button>
      <Button>DRAFT</Button>
    </Wrapper>
  );
}

export default App;
