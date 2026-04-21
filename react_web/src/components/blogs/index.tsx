import SEO from "@/utils/seo";
import { SEO_BLOGS } from "@/helper/constants";
import { Box } from "@chakra-ui/react";
import Wrapper from "@/share/organisms/Wrapper";
import "./styles.css";

import NewsSection from "./sections/news";
import TagsSection from "./sections/tags";
import QuestionOfTheDay from "./sections/question-of-the-day";
import BlogsSection from "./sections/blogs";
// import QuoteOfTheDay from "./sections/quote-of-the-day";
import CategoriesSection from "./sections/categories";
import { TextInput } from "@/share/atoms/input";
import { useState } from "react";

function Blogs() {
  return (
    <Wrapper>
      <SEO {...SEO_BLOGS} />
      <Box className="row">
        {/* -------------LEFT SIDE BAR------------- */}
        <Box className="col-2" position={"sticky"} top={"80px"} p={"0 12px"}>
          <SearchInput />
          <CategoriesSection />
          <TagsSection />
        </Box>
        {/* -------------MAIN SECTION------------- */}
        <Box className="col-6 custom-scroll">
          <BlogsSection />
        </Box>
        {/* -------------RIGHT SECTION------------- */}
        <Box className="col-4 custom-scroll" p={"0 12px"}>
          <NewsSection />
          <QuestionOfTheDay />
        </Box>
      </Box>
    </Wrapper>
  );
}

export default Blogs;

const SearchInput = () => {
  const [value, setValue] = useState("");
  return (
    <>
      <TextInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={"Search..."}
        borderRadius={"24px"}
      />
    </>
  );
};
