import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import PasswordInput from ".";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/utils/theme";

const meta = {
  title: "Atoms/PasswordInput",
  component: PasswordInput,
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
  args: { onChange: fn() }
} satisfies Meta<typeof PasswordInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Password: Story = {
  args: {
    variant:"error",
    value: "Hello",
    placeholder: "Enter Name",
    name: "hello",
    id: "hello"
  },
  argTypes: {
    value: { control: "text" }
  },
  render: (args) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      args.onChange?.(e);
      args.value = e.target.value;
    };

    return <PasswordInput {...args} onChange={handleChange} />;
  }
};
