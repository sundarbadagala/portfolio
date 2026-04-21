import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import CloseTag from ".";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/utils/theme";

const meta = {
  title: "Atoms/Close Tag",
  component: CloseTag,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story: any) => (
      <ChakraProvider theme={theme}>
        <Story />
      </ChakraProvider>
    ),
  ],
  args: { onClick: fn() },
} satisfies Meta<typeof CloseTag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const tag: Story = {
  args: {
    value: "Hello World",
    size: "sm"
  },
};