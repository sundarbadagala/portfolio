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
        <DrawerContent maxH={"90vh"}>
          <DrawerBody maxH={"90vh"} overflowY={"auto"} data-lenis-prevent>
            {children}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default BottomSheet;
