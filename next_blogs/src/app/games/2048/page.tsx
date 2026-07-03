import Container from "@/shared/components/Container";
import Wrapper from "@/shared/components/Wrapper";
import React from "react";

function Page() {
  return (
    <Wrapper>
      <Container>
        <iframe
          src="/games/2048/index.html"
          width="100%"
          height="800"
          style={{ border: "none" }}
        />
      </Container>
    </Wrapper>
  );
}

export default Page;
