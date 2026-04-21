import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay
} from "@chakra-ui/react";
import { IProps } from "./index.interface";

function BottomSheet({ isOpen, onClose, children }: IProps) {
  return (
    <>
      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody minH={"500px"} maxHeight={"90vh"} overflow={"auto"}>
            {children}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default BottomSheet;
