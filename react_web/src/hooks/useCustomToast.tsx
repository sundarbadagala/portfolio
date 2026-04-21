import { useToast } from "@chakra-ui/react";

interface IConfig {
  isClosable: boolean;
  duration: number;
  position: "top-right";
}

function useCustomToast() {
  const toast = useToast();
  const config: IConfig = {
    isClosable: true,
    duration: 3000,
    position: "top-right",
  };
  const handleToast = (() => {
    return {
      success(message: string) {
        toast({
          title: message,
          status: "success",
          ...config,
        });
      },
      error(message: string) {
        toast({
          title: message,
          status: "error",
          ...config,
        });
      },
    };
  })();
  return handleToast;
}

export default useCustomToast;
