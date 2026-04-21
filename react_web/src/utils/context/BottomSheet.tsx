import { useState, createContext, ReactNode, useContext } from "react";

interface BottomSheetContextType {
  isOpen: boolean;
  handleOpen: (content: any) => void;
  handleClose: () => void;
  Content: any;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined
);

interface BottomSheetProviderProps {
  children: ReactNode;
}

const BottomSheetProvider = ({ children }: BottomSheetProviderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [Content, setContent] = useState<any>(null);
  const handleOpen = (content: any) => {
    setContent(content);
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <BottomSheetContext.Provider
      value={{ isOpen, handleOpen, handleClose, Content }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error("useBottomSheet must be used inside BottomSheetProvider");
  }
  return context;
};

export { BottomSheetProvider, useBottomSheet };
