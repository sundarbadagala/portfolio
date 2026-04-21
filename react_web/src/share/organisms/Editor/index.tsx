import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { uploadToCloudinary } from "@/helper/methods";

function CustomEditor({ onData }: { onData: (arg1: string) => void }) {
  const editorRef: any = useRef(null);
  const handleData = () => {
    onData(editorRef.current.getContent());
  };
  return (
    <>
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
        onInit={(_evt, editor) => (editorRef.current = editor)}
        init={{
          plugins:
            "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker",
          toolbar:
            "undo redo | blocks fontsize | styleselect | bold italic underline strikethrough | link customUpload image media | alignleft aligncenter alignright alignjustify",
          setup: (editor) => {
            editor.ui.registry.addButton("customUpload", {
              text: "Upload Image",
              onAction: async () => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";

                input.onchange = async () => {
                  const file = input.files?.[0];
                  if (!file) return;
                  const url = await uploadToCloudinary(file);
                  editor.insertContent(
                    `<img src="${url}" style="max-width:100%;" />`
                  );
                };

                input.click();
              }
            });
          }
        }}
        initialValue="Welcome to TinyMCE!"
        onBlur={handleData}
      />
    </>
  );
}

export default CustomEditor;
