import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import TextInput from ".";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/utils/theme";

const meta = {
  title: "Atoms/TextInput",
  component: TextInput,
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
  args: { onChange: fn() },
} satisfies Meta<typeof TextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    variant:'primary',
    value: "Hello",
    placeholder: "Enter Name",
    name: "hello",
    id: "hello",
  },
  argTypes: {
    value: { control: "text" },
  },
  render: (args) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      args.onChange?.(e);
      args.value = e.target.value;
    };

    return <TextInput {...args} onChange={handleChange} />;
  },
};
