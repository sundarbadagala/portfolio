import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import ThemeButton  from './index';
import { useColorMode } from '@chakra-ui/react';

// Mock the useColorMode hook
jest.mock('@chakra-ui/react', () => {
  return {
    ...jest.requireActual('@chakra-ui/react'),
    useColorMode: jest.fn(),
  };
});

describe('ThemeButton Component', () => {
  const toggleColorModeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithChakraProvider = (colorMode: string) => {
    (useColorMode as jest.Mock).mockReturnValue({
      colorMode,
      toggleColorMode: toggleColorModeMock,
    });

    render(
      <ChakraProvider theme={extendTheme()}>
        <ThemeButton />
      </ChakraProvider>
    );
  };

  test('renders light mode icon when color mode is dark', () => {
    renderWithChakraProvider('dark');

    expect(screen.getByTestId('light-btn')).toBeInTheDocument();
  });

  test('renders dark mode icon when color mode is light', () => {
    renderWithChakraProvider('light');

    expect(screen.getByTestId('dark-btn')).toBeInTheDocument();
  });

  test('toggles color mode when clicked', () => {
    renderWithChakraProvider('light');
    fireEvent.click(screen.getByTestId('theme-btn'));
    expect(toggleColorModeMock).toHaveBeenCalled();
  });
});
