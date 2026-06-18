import Container from "@/shared/components/Container";
import React from "react";

function Page() {
  return (
    <main className="min-h-screen">
      <Container>
        <iframe
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs.html`}
          className="w-full h-[100vh]"
        ></iframe>
      </Container>
    </main>
  );
}

export default Page;
