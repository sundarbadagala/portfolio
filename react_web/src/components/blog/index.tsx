import React from "react";
import DOMPurify from "dompurify";
import { getBlogId } from "@/helper/methods";
import Wrapper from "@/share/organisms/Wrapper";
import "@/styles/hljs.css";
import { connect } from "react-redux";
import SEO from "@/utils/seo";
import { blogRequest } from "./slice.blog";
import { IState, IProps } from "./interface";

class Blog extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      blogsData: []
    };
  }
  componentDidMount(): void {
    const paramId = getBlogId(window.location.pathname);
    this.props.blogRequest(paramId);
  }

  render(): React.ReactNode {
    const { content, title, tags } = this.props.blog.data;
    return (
      <Wrapper>
        <SEO
          title="Javascript Closure"
          name="Javascript Closure"
          description="Javascript Closure"
          keywords="hi"
          type="hi"
        />
        <h1>{title}</h1>
        <div style={{ display: "flex", gap: "4px", fontWeight: "bold" }}>
          {tags?.map((tag: string) => (
            <code>#{tag}</code>
          ))}
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(content)
          }}
        />
      </Wrapper>
    );
  }
}

const mapStateToProps = (state: any) => ({
  blog: state.blog
});

const mapDispatchToProps = {
  blogRequest
};

export default connect(mapStateToProps, mapDispatchToProps)(Blog);
