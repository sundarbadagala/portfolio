import type { Meta, StoryObj } from "@storybook/react";
import ThemeButton from ".";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/utils/theme";

const meta = {
  title: "Molecules/ThemeButton",
  component: ThemeButton,
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
} satisfies Meta<typeof ThemeButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
