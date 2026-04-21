import { useColorMode } from "@chakra-ui/react";
import styles from "./styles.module.css";

function ContactLink({ children, href, target }: any) {
  const { colorMode } = useColorMode();
  console.log("a.a.", colorMode);
  return (
    <a
      href={href}
      target={target}
      className={colorMode === "light" ? styles.link : styles.link_dark}
    >
      {children}
    </a>
  );
}

export default ContactLink;
