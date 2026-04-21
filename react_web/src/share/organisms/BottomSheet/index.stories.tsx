import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import BottomSheet from ".";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/utils/theme";

const meta = {
  title: "Organisms/BottomSheet",
  component: BottomSheet,
  parameters: {
    layout: "centered"
  },
  decorators: [
    (Story: any) => (
      <ChakraProvider theme={theme}>
        <Story />
      </ChakraProvider>
    )
  ],
  tags: ["autodocs"],
  args: { onClose: fn() }
} satisfies Meta<typeof BottomSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const bottomSheet: Story = {
  args: {
    children: (
      <>
        <h1>Header</h1>
        <p>Content</p>
      </>
    ),
    isOpen: false
  }
};
