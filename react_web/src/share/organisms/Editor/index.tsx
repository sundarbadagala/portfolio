import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { uploadToCloudinary } from "@/helper/methods";

function CustomEditor({ onData, initialValue }: { onData: (arg1: string) => void, initialValue?: string }) {
  const editorRef: any = useRef(null);
  const handleData = () => {
    console.log(editorRef.current.getContent());
    onData(editorRef.current.getContent());
  };
  return (
    <>
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
        onInit={(_evt, editor) => (editorRef.current = editor)}
        init={{
          plugins:
            "advlist lists paste anchor autolink charmap codesample emoticons hr image link media searchreplace table visualblocks wordcount linkchecker",

          toolbar:
            "undo redo | blocks fontsize | styleselect | bold italic underline strikethrough | bullist numlist | link customUpload image media | hr | alignleft aligncenter alignright alignjustify",

          paste_as_text: false,

          // Don't preserve every style from clipboard
          paste_webkit_styles: "none",
          paste_merge_formats: true,

          // Don't allow every HTML element
          valid_elements:
            "p,h1,h2,h3,h4,h5,h6,strong/b,em/i,ul,ol,li,blockquote,pre,code,br,hr,a[href|target],img[src|alt|width|height|style]",

          extended_valid_elements:
            "pre[class],code[class],span[class]",

          content_style: `
    body {
      font-family: Arial, sans-serif;
    }
  `,

          statusbar: false,

          paste_postprocess: (_plugin, args) => {
            // Remove empty divs copied from ChatGPT
            args.node.querySelectorAll("div").forEach((div) => {
              if (
                div.childElementCount === 0 &&
                div.textContent?.trim() === ""
              ) {
                div.remove();
              }
            });

            // Flatten unnecessary div wrappers around <pre>
            args.node.querySelectorAll("pre").forEach((pre) => {
              let parent = pre.parentElement;

              while (
                parent &&
                parent.tagName === "DIV" &&
                parent.childElementCount === 1
              ) {
                const grandParent = parent.parentNode;

                if (!grandParent) break;

                grandParent.insertBefore(pre, parent);
                parent.remove();

                parent = pre.parentElement;
              }
            });
          },

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
              },
            });
          },
        }}
        initialValue={initialValue || "Welcome to TinyMCE!"}
        onBlur={handleData}
      />
    </>
  );
}

export default CustomEditor;
