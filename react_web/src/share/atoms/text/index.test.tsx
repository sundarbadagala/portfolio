import { render, screen } from "@testing-library/react";
import { HeaderText } from "./index";

describe("Text", () => {
  it("Header text render", () => {
    render(<HeaderText>Hello World</HeaderText>);
    const childEl = screen.getByText('Hello World')
    expect(childEl).toBeInTheDocument()
  });
});