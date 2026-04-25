import ApiHandler from ".";

const apiHandler = ApiHandler({
  baseUrl: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiHandler.config.request((config: any) => {
  config.headers.version = "1.0.0";
  config.headers.platform = "web";
  config.headers.Author = "blog";
  config.headers['x-token'] = localStorage.getItem('token') || "";
  return config;
});

apiHandler.config.response((res: any) => {
  try {
    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.replace("/");
    } else {
      return res;
    }
  } catch (error) {
    return error;
  }
});

export { apiHandler };
