import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import HashTag from ".";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/utils/theme";

const meta = {
  title: "Atoms/Hash Tag",
  component: HashTag,
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
} satisfies Meta<typeof HashTag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const tag: Story = {
  args: {
    value:'Hello World',
    size: "sm"
  },
};
