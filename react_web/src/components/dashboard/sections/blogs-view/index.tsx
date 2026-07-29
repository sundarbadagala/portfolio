import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import Wrapper from "@/share/organisms/Wrapper";
import "@/styles/hljs.css";
import { useSearchParams } from "react-router-dom";
import { blogsService } from "../../service";
import { HashTag } from "@/share/atoms/tag";
import { Text } from "@chakra-ui/react";


function BlogsView() {
    const [params] = useSearchParams()
    const content_id = params.get('content_id')

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tagOptions, setTagOptions] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        (async () => {
            if (content_id) {
                const res = await blogsService.getBlogApi(content_id)
                if (res.status === 200) {
                    const { title, content, tags } = res.data.data
                    setTitle(title)
                    setContent(content)
                    setTagOptions(tags)
                }
            }
        })()
    }, [content_id])
    return (
        <Wrapper>
            <Text variant={'H2'}>{title}</Text>
            <div style={{ display: "flex", gap: "4px", fontWeight: "bold", margin: "24px 0" }}>
                {tagOptions?.map((tag) => (
                    <HashTag value={tag.label} />
                ))}
            </div>
            <div
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(content)
                }}
            />
        </Wrapper>
    )
}

export default BlogsView



// class Blog extends React.Component<IProps, IState> {
//   constructor(props: IProps) {
//     super(props);
//     this.state = {
//       blogsData: []
//     };
//   }
//   componentDidMount(): void {
//     const paramId = getBlogId(window.location.pathname);
//     this.props.blogRequest(paramId);
//   }

//   render(): React.ReactNode {
//     const { content, title, tags } = this.props.blog.data;
//     return (
//       <Wrapper>
//         <SEO
//           title="Javascript Closure"
//           name="Javascript Closure"
//           description="Javascript Closure"
//           keywords="hi"
//           type="hi"
//         />
//         <h1>{title}</h1>
//         <div style={{ display: "flex", gap: "4px", fontWeight: "bold" }}>
//           {tags?.map((tag: string) => (
//             <code>#{tag}</code>
//           ))}
//         </div>
//         <div
//           dangerouslySetInnerHTML={{
//             __html: DOMPurify.sanitize(content)
//           }}
//         />
//       </Wrapper>
//     );
//   }
// }

// const mapStateToProps = (state: any) => ({
//   blog: state.blog
// });

// const mapDispatchToProps = {
//   blogRequest
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Blog);
