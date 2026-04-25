import ApiHandler from "./http";

const apiHandler = ApiHandler({
  baseUrl: process.env.API_BASE_URL ?? "https://api-node-82xn.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  errorRetry: {
    retryTimes: 2,
    retryDelay: 300,
  },
});

apiHandler.config.request((config) => {
  config.headers = {
    ...(config.headers as Record<string, string>),
    version: "1.0.0",
    platform: "web",
    Author: "blog",
  };
  return config;
});

apiHandler.config.response((res) => {
  if (res.status === 401) {
    throw new Error("Unauthorized");
  }
  return res;
});

export { apiHandler };
