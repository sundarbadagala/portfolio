import { useState, createContext, ReactNode, useContext } from "react";

interface ToastContextType {
  isShow: boolean;
  handleShow: (message: string, type?: "success" | "error" | "warning") => void;
  handleHide: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

const ToastProvider = ({ children }: ToastProviderProps) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const handleShow = (message: string, type = "success") => {
    console.log("use.toast", message);
    console.log("use.toast", type);
    setIsShow(true);
  };
  const handleHide = () => {
    setIsShow(false);
  };
  return (
    <ToastContext.Provider value={{ isShow, handleShow, handleHide }}>
      {children}
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
};

export { ToastProvider, useToast };
