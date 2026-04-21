import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useColorMode } from "@chakra-ui/react";
import PublicRoutes from "./utils/routing/publicRoutes";
import PrivateRoutes from "./utils/routing/privateRoutes";
import { publicRoutes, privateRoutes } from "./helper/routes";
import LogInLayout from "./layouts/LogIn";
import LoggedInLayout from "./layouts/LoggedIn";
import BottomSheet from "./share/organisms/BottomSheet";
import { useBottomSheet } from "./utils/context/BottomSheet";

function App() {
  const { colorMode, setColorMode } = useColorMode();
  const { isOpen, Content, handleClose } = useBottomSheet();

  useEffect(() => {
    // Force dark mode as default theme
    if (colorMode !== 'dark') {
      setColorMode('dark');
    }
  }, [colorMode, setColorMode]);

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={handleClose}>
        {Content}
      </BottomSheet>
      <Routes>
        <Route element={<LogInLayout />}>
          {publicRoutes.map((item, index) => (
            <Route
              element={<PublicRoutes isCommonRoute={item.isCommonRoute} />}
              key={index}
            >
              <Route element={item.element} path={item.path} />
            </Route>
          ))}
        </Route>

        <Route element={<LoggedInLayout />}>
          {privateRoutes.map((item, index) => (
            <Route element={<PrivateRoutes />} key={index}>
              <Route element={item.element} path={item.path} />
            </Route>
          ))}
        </Route>
      </Routes>
    </>
  );
}

export default App;
