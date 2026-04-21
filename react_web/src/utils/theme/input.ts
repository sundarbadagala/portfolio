import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import { colors } from "./colors";

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(inputAnatomy.keys);

const primary = definePartsStyle({
    field: {
        bg: "transparent",
        borderRadius: "md",
        borderWidth: "1px",
        borderColor: colors.mono[800],
        _focus: {
            borderColor: "blue.500",
            boxShadow: "0 0 0 1px blue.500",
        },
        _disabled: {
            borderWidth: "1px",
            borderColor: colors.mono[600],
        },
        _dark: {
            borderWidth: '1px',
            borderColor: colors.mono[300]
        }
    },
});

const error = definePartsStyle({
    field: {
        bg: "transparent",
        borderRadius: "md",
        borderWidth: "1px",
        borderColor: colors.error[600],
        _focus: {
            borderColor: "blue.500",
            boxShadow: "0 0 0 1px blue.500",
        },
    },
});

const success = definePartsStyle({
    field: {
        bg: "transparent",
        borderRadius: "md",
        borderWidth: "1px",
        borderColor: "green.500",
        _focus: {
            borderColor: "blue.500",
            boxShadow: "0 0 0 1px blue.500",
        },
    },
});

export const inputTheme = defineMultiStyleConfig({
    variants: { primary, error, success },
});
