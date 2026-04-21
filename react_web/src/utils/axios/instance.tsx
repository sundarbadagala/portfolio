import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";

interface CustomAxiosRequestHeaders extends AxiosRequestHeaders {
  Accept: string;
  "Content-Type": string;
  Authorization: string;
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  paramsSerializer: (params) => {
    return new URLSearchParams(params).toString();
  },
});

function setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}

const onRequest = (config: InternalAxiosRequestConfig) => {
  config.headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")} `,
  } as CustomAxiosRequestHeaders;
  return config;
};

const onRequestError = (error: AxiosError) => {
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  if (response.status === 200) {
    return response;
  } else {
    return response;
  }
};

const onResponseError = (error: AxiosError) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem("token");
  } else if (error.response && error.response.status === 500) {
    return Promise.reject(error.response);
  } else return Promise.reject(error);
};

setupInterceptorsTo(instance);

export default instance;
