import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./index";

describe("Primary Button", () => {
  const mockOnClick = jest.fn();
  it("Primary button renders successfully", () => {
    render(<Button>Click Here</Button>);
    const el = screen.getByTestId("primary-btn");
    expect(el).toBeInTheDocument();
  });
  it("Primary button renders child text ", () => {
    render(<Button>Click Here</Button>);
    const el = screen.getByTestId("primary-btn");
    expect(el).toHaveTextContent("Click Here");
  });
  it("Primary button renders disable ", () => {
    render(<Button isDisabled={true}>Click Here</Button>);
    const el = screen.getByTestId("primary-btn");
    expect(el).toBeDisabled();
  });
  it("Primary button is clickable", async () => {
    render(<Button>Click Here</Button>);
    const el = screen.getByTestId("primary-btn");
    fireEvent.click(el);
    expect(el).toBeVisible();
  });
  test("calls onClick when clicked", () => {
    render(<Button onClick={mockOnClick}>Click Me</Button>);

    const button = screen.getByTestId("primary-btn");
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
  
});
