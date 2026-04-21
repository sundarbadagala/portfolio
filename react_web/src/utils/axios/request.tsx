import instance from "./instance";

export const request = (function () {
  return {
    get: (url: string, params?: object) => instance.get(url, { params }),
    post: (url: string, options: object) => instance.post(url, options),
  };
})();
