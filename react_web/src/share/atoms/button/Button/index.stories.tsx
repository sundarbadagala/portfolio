import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Button from ".";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/utils/theme";

const meta = {
  title: "Atoms/Button",
  component: Button,
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
  tags: ["autodocs"],
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const button: Story = {
  args: {
    variant: "primary",
    children: "Button",
    isDisabled: false
  },
};
