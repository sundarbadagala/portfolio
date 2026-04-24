import Container from "@/components/Container";

export default function Page() {
  return (
    <main className="min-h-screen">
      <Container>
        <div className="flex flex-wrap">
          <div className="hidden min-[960px]:block w-1/6" id="left-section">jlkj</div>
          <div className="w-1/2" id="main-section">ajkflajf</div>
          <div className="w-1/3" id='right-section'>jafljaf</div>
        </div>
      </Container>
    </main>
  );
}
