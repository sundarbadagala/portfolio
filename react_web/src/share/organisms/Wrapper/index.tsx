import { Box } from "@chakra-ui/react";

function Wrapper({
  children,
  styles,
}: {
  children: React.ReactElement | string | React.ReactNode;
  styles?: object;
}) {
  return <Box p={'24px 0'} style={styles}>{children}</Box>;
}

export default Wrapper;
