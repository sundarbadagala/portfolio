import { useToast } from "@chakra-ui/react";

const useCustomToast = () => {
  const toast = useToast();
  const handleToast = (() => {
    return {
      success: (description: string) => {
        toast({
          description,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
          render: ({ id, description }: any) => (
            <div
              id={id?.toString()}
              style={{
                padding: "12px",
                borderRadius: "4px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                color: "#4dff5e",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid #4dff5e"
              }}
            >
              {description}
            </div>
          )
        });
      },
      error: (description: string) => {
        toast({
          description,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
          render: ({ id, description }: any) => (
            <div
              id={id?.toString()}
              style={{
                padding: "12px",
                borderRadius: "4px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                color: "#ff4f4f",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid #ff4f4f"
              }}
            >
              {description}
            </div>
          )
        });
      }
    };
  })();
  return handleToast;
};

export default useCustomToast;
