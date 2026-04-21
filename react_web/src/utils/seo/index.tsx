import { Helmet } from "react-helmet-async";
import { IProps } from "./index.interface";

export default function SEO({
  title,
  description,
  name,
  type,
  keywords,
  author,
}: IProps) {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta charSet="UTF-8" />
      <meta name="description" content={description} />
      {/* <meta name="keywords" content="keyword1, keyword2, keyword3" /> */}
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      {/* End standard metadata tags */}
      {/* Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* End Facebook tags */}
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content={type} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {/* End Twitter tags */}
    </Helmet>
  );
}
