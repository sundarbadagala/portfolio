import { ReactNode } from "react";
import { useColorMode } from "@chakra-ui/react";
import styles from "./styles.module.css";

interface ContactLinkProps {
  children: ReactNode;
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
}

function ContactLink({ children, href, target }: ContactLinkProps) {
  const { colorMode } = useColorMode();

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
