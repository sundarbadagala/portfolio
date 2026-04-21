import ReactDOM from "react-dom/client";
import { BrowserRouter as RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider as ReduxProvider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import ErrorBoundary from "@/utils/errorBoundary";
import { theme } from "@/utils/theme";
import { store } from "@/utils/store/store.ts";
import "./styles/hljs.css";
import "./styles/grid.css";
import "./styles/flex.css";
import { ToastProvider } from "./utils/context/Toast.tsx";
import { BottomSheetProvider } from "./utils/context/BottomSheet.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <ReduxProvider store={store}>
      <RouterProvider>
        <BottomSheetProvider>
          <ToastProvider>
            <ChakraProvider theme={theme}>
              <ErrorBoundary fallback={<div>Oops! Something went wrong.</div>}>
                <App />
              </ErrorBoundary>
            </ChakraProvider>
          </ToastProvider>
        </BottomSheetProvider>
      </RouterProvider>
    </ReduxProvider>
  </HelmetProvider>
);
