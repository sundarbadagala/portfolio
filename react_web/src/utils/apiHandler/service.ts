import ApiHandler from ".";

const apiHandler = ApiHandler({
  baseUrl: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    version: "1.0.0"
  },
  config: {
    mode: 'cors',
    cache: 'no-cache'
  },
  errorRetry: {
    retryTimes: 2,
    retryDelay: 1000,
  }
});

apiHandler.config.request((config: any) => {
  config.headers.platform = "web";
  config.headers.Author = "blog";
  config.headers['x-token'] = localStorage.getItem('token') || "";
  return config;
});

apiHandler.config.response((res: any) => {
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.replace("/");
  }
  return res;
});

export { apiHandler };
