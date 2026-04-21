import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import BottomSheet from ".";

function renderWithChakra(ui: any) {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
}

describe("Bottom Sheet", () => {
  it("render Bottom Sheet", () => {
    renderWithChakra(
      <BottomSheet isOpen={true} onClose={() => {}}>
        bottom sheet open
      </BottomSheet>
    );
    expect(screen.getByText("bottom sheet open")).toBeInTheDocument();
  });
});
