import { Button as ChakraButton } from "@chakra-ui/react";
import { IButton } from "./index.interface";

function Button({
  children,
  variant = "primary",
  size = "md",
  isDisabled,
  onClick,
  ...rest
}: IButton) {
  return (
    <ChakraButton
      variant={variant}
      size={size}
      onClick={onClick}
      data-testid="primary-btn"
      isDisabled={isDisabled}
      className="primary-btn"
      {...rest}
    >
      {children}
    </ChakraButton>
  );
}

export default Button;
