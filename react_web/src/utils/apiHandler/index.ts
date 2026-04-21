// const VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0";
const VERSION = "1.0.0"

const RETRY_ERROR_CODES = /^[5][0-9]{2}$/i;

interface ErrorRetryConfig {
  retryTimes?: number;
  retryDelay?: number;
  onRetry?: (info: { method: string; api: string; reqBody?: any }) => void;
}

interface ApiHandlerOptions {
  baseUrl: string;
  headers?: HeadersInit;
  config?: RequestInit;
  errorRetry?: ErrorRetryConfig;
}

interface RequestOptions {
  params?: Record<string, any>;
  payload?: any;
  retryTimes?: number;
  retryDelay?: number;
  onRetry?: (info: { method: string; api: string; reqBody?: any }) => void;
  headers?: HeadersInit;
  fileName?: string;
  onDownloadProgress?: (percentage: number) => void;
}

interface ApiResponse {
  status: number;
  statusText: string;
  data: any;
}

const defaultconfig: RequestInit = {
  mode: "cors",
  cache: "no-cache",
};

const defaultheaders: HeadersInit = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

function ApiHandler({
  baseUrl,
  headers = defaultheaders,
  config = defaultconfig,
  errorRetry,
}: ApiHandlerOptions) {
  let responseCallback:
    | ((data: ApiResponse, config?: Record<string, any>) => ApiResponse | Promise<ApiResponse>)
    | undefined;

  let requestCallback:
    | ((options: RequestInit) => RequestInit)
    | undefined;

  const {
    retryTimes = 0,
    retryDelay = 100,
    onRetry = () => {},
  } = errorRetry || {};

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  function getFormattedApi(baseUrl: string, endpoint: string): string {
    return endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;
  }

  async function requestHandler(
    method: string,
    endpoint: string,
    reqBody?: any,
    rest: RequestOptions = {}
  ): Promise<Response> {
    const {
      retryTimes: _retryTimes = retryTimes,
      retryDelay: _retryDelay = retryDelay,
      onRetry: _onRetry = onRetry,
      headers: _headers,
    } = rest;

    const formattedUrl = getFormattedApi(baseUrl, endpoint);

    let body: BodyInit | null = null;
    if (method !== "GET" && reqBody !== undefined) {
      if (reqBody instanceof FormData || typeof reqBody === "string") {
        body = reqBody;
      } else {
        body = JSON.stringify(reqBody);
      }
    }

    const options: RequestInit = {
      method,
      ...config,
      headers: {
        ...headers,
        ..._headers,
      },
      body,
    };

    const reqOptions = requestCallback ? requestCallback(options) : options;

    try {
      const res = await fetch(formattedUrl, reqOptions);

      // Retry only for 5xx codes
      if (!res.ok && RETRY_ERROR_CODES.test(String(res.status)) && _retryTimes > 0) {
        await delay(_retryDelay);
        _onRetry({ method, api: formattedUrl, reqBody });
        return requestHandler(method, endpoint, reqBody, {
          ...rest,
          retryTimes: _retryTimes - 1,
        });
      }

      return res;
    } catch (err: any) {
      // Retry for network errors
      if (_retryTimes > 0) {
        await delay(_retryDelay);
        _onRetry({ method, api: formattedUrl, reqBody });
        return requestHandler(method, endpoint, reqBody, {
          ...rest,
          retryTimes: _retryTimes - 1,
        });
      }
      throw err;
    }
  }

  async function responseHandler(res: Response, apiConfig?: any): Promise<ApiResponse> {
    const isJson = res.headers.get("content-type")?.includes("application/json");
    let data: any = null;

    try {
      data = isJson ? await res.json() : await res.text();
    } catch {
      // Gracefully handle non-JSON or empty responses
    }

    const result = {
      status: res.status,
      statusText: res.statusText,
      data,
    };

    return responseCallback ? responseCallback(result, apiConfig) : result;
  }

  const downloadHandler = async (
    response: Response,
    fileName?: string,
    onDownloadProgress?: (percentage: number) => void
  ) => {
    const contentLength = response.headers.get("Content-Length");
    const reader = response.body?.getReader();
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    let received = 0;
    const chunks: Uint8Array[] = [];

    if (!reader) throw new Error("ReadableStream not supported");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        received += value.length;
        const percentage = total ? Math.round((received * 100) / total) : 0;
        onDownloadProgress?.(percentage);
      }
    }

    reader.releaseLock();

    const blob = new Blob(chunks as BlobPart[], {
      type: response.headers.get("Content-Type") || "application/octet-stream",
    });

    const link = document.createElement("a");
    const urlBlob = URL.createObjectURL(blob);
    link.href = urlBlob;
    link.download = fileName || "file";
    link.click();

    // Revoke after short delay for browser safety
    setTimeout(() => URL.revokeObjectURL(urlBlob), 2000);

    return {
      status: 200,
      data: "File downloaded successfully",
      statusText: "success",
    };
  };

  return {
    VERSION,
    config: {
      request(callback: (options: RequestInit) => RequestInit) {
        requestCallback = callback;
      },
      response(
        callback: (data: ApiResponse, config?: Record<string, any>) => ApiResponse | Promise<ApiResponse>
      ) {
        responseCallback = callback;
      },
    },

    async get(endpoint: string, options: RequestOptions = {}) {
      const { params = null, ...rest } = options;
      const queryString = new URLSearchParams(params || {}).toString();
      const formattedApi = getFormattedApi(baseUrl, endpoint);
      const API = params ? `${formattedApi}?${queryString}` : formattedApi;
      const apiConfig = { endpoint, ...options, method: "GET" };
      const res = await requestHandler("GET", API, null, rest);
      return responseHandler(res, apiConfig);
    },

    async post(endpoint: string, options: RequestOptions = {}) {
      const { payload = null, ...rest } = options;
      const API = getFormattedApi(baseUrl, endpoint);
      const apiConfig = { endpoint, ...options, method: "POST" };
      const res = await requestHandler("POST", API, payload, rest);
      return responseHandler(res, apiConfig);
    },

    async put(endpoint: string, options: RequestOptions = {}) {
      const { payload = null, ...rest } = options;
      const API = getFormattedApi(baseUrl, endpoint);
      const apiConfig = { endpoint, ...options, method: "PUT" };
      const res = await requestHandler("PUT", API, payload, rest);
      return responseHandler(res, apiConfig);
    },

    async download(endpoint: string, options: RequestOptions = {}) {
      const { params = null, fileName, onDownloadProgress, ...rest } = options;
      const queryString = new URLSearchParams(params || {}).toString();
      const formattedApi = getFormattedApi(baseUrl, endpoint);
      const API = params ? `${formattedApi}?${queryString}` : formattedApi;
      const res = await requestHandler("GET", API, null, rest);
      return downloadHandler(res, fileName, onDownloadProgress);
    },
  };
}

export default ApiHandler;
