import { render, screen, fireEvent } from "@testing-library/react";
import TagItem from "./index";
import { CloseIcon } from "@chakra-ui/icons";

describe("TagItem Component", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders TagItem with given value and default icon", () => {
    render(<TagItem value="Test Tag" />);

    expect(screen.getByText(/Test Tag/i)).toBeInTheDocument();
  });

  // test("renders TagItem with a custom size", () => {
  //   render(<TagItem value="Test Tag" size="md" />);

  //   expect(screen.getByTestId("close-tag")).toHaveStyle(
  //     `padding: ${TAGS_SIZES.md}`
  //   );
  // });

  test("calls onClick handler when icon is clicked", () => {
    render(<TagItem value="Test Tag" icon={CloseIcon} onClick={mockOnClick} />);

    fireEvent.click(screen.getByTestId("close-tag-icon"));

    expect(mockOnClick).toHaveBeenCalled();
  });

  test("applies custom styles correctly", () => {
    const customStyle = { backgroundColor: "red" };
    render(<TagItem value="Test Tag" style={customStyle} />);

    expect(screen.getByTestId("close-tag")).toHaveStyle(
      "background-color: red"
    );
  });
});
