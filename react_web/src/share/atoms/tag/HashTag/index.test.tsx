import { render, screen, fireEvent } from "@testing-library/react";
import TagItem from "./index";
// import { getRandomColor } from "@/helper/methods";
import { getRandomColor } from "../../../../helper/methods";

jest.mock("../../../../helper/methods", () => ({
  getRandomColor: jest.fn(),
}));

describe("TagItem Component", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders TagItem with given value", () => {
    (getRandomColor as jest.Mock).mockReturnValue("blue");
    render(<TagItem value="Test Tag" onClick={mockOnClick} />);
    expect(screen.getByText(/Test Tag/i)).toBeInTheDocument();
    expect(getRandomColor).toHaveBeenCalled();
  });

  test("calls onClick handler with correct value when clicked", () => {
    (getRandomColor as jest.Mock).mockReturnValue("green");
    render(<TagItem value="Clickable Tag" onClick={mockOnClick} />);
    fireEvent.click(screen.getByText(/Clickable Tag/i));
    expect(mockOnClick).toHaveBeenCalledWith("Clickable Tag");
  });

  test("applies custom styles correctly", () => {
    (getRandomColor as jest.Mock).mockReturnValue("red");
    const customStyle = { border: "1px solid black" };
    render(
      <TagItem value="Styled Tag" onClick={mockOnClick} style={customStyle} />
    );
    expect(screen.getByTestId("hash-tag")).toHaveStyle(
      `border: 1px solid black;`
    );
  });

  test("renders with specified size", () => {
    (getRandomColor as jest.Mock).mockReturnValue("yellow");
    render(<TagItem value="Sized Tag" size="lg" onClick={mockOnClick} />);
    expect(screen.getByText(/Sized Tag/i)).toBeInTheDocument();
  });
});
