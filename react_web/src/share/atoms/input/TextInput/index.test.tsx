import { render, screen, fireEvent } from "@testing-library/react";
import TextInput from "./index"; // Adjust the import path as necessary
import { useState } from "react";

function Wrapper() {
  const [val, setVal] = useState("hi");
  return (
    <TextInput
      value={val}
      onChange={(e) => setVal(e.target.value)}
    />
  );
}

describe("TextInput Component", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders with correct value and placeholder", () => {
    render(
      <TextInput
        value="Test Value"
        onChange={mockOnChange}
        placeholder="Enter text"
        name="test"
        id="test-id"
      />
    );
    const inputElement = screen.getByTestId("text-input");
    expect(inputElement).toHaveValue("Test Value");
    expect(inputElement).toHaveAttribute("placeholder", "Enter text");
  });

  test("calls onChange handler when input changes", () => {
    render(
      <TextInput
        value=""
        onChange={mockOnChange}
        placeholder="Enter text"
        name="test"
        id="test-id"
      />
    );

    const inputElement = screen.getByTestId("text-input");
    fireEvent.change(inputElement, { target: { value: "New Value" } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  test("renders with correct name and id", () => {
    render(
      <TextInput
        value=""
        onChange={mockOnChange}
        placeholder="Enter text"
        name="test"
        id="test-id"
      />
    );

    const inputElement = screen.getByTestId("text-input");
    expect(inputElement).toHaveAttribute("name", "test");
    expect(inputElement).toHaveAttribute("id", "test-id");
  });
  test("change", () => {
    render(<TextInput value={"hello world"} onChange={() => {}} />);
    const txtEl = screen.getByTestId("text-input") as any;
    expect(txtEl.value).toBe("hello world");
  });
  test("render", async () => {
    render(<TextInput value={"hello world"} onChange={() => {}} />);
    const txtEl: any = screen.getByTestId("text-input");
    expect(txtEl).toBeInTheDocument();
  });

 test("changes", () => {
  render(<Wrapper />);
  const txtEl:any = screen.getByTestId("text-input");

  fireEvent.change(txtEl, { target: { value: "Hi world" } });

  expect(txtEl.value).toBe("Hi world");
});
});
