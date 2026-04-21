import useCustomToast from "./useCustomToast";
import { TOAST_MESSAGE } from "@/helper/constants";

type CallbackFunction<T extends any[]> = (...args: T) => void | Promise<void>;

const useOnline = <T extends any[], R = void>(
  callback: CallbackFunction<T>
): ((...args: T) => R | void) => {
  const toast = useCustomToast();

  return (...args: T): R | void => {
    const isOnline = navigator.onLine;
    if (!isOnline) {
      toast.error(TOAST_MESSAGE.offline);
      return;
    } else {
      return callback(...args) as R;
    }
  };
};

export default useOnline;
