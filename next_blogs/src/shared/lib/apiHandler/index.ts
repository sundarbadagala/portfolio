import ApiHandler from './app'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const api = ApiHandler({
    baseUrl: API_URL,
    config: {
        credentials: 'include'
    }
});

api.config.response((response) => {
    if (response.status < 200 || response.status >= 300) {
        const data = response.data as { error?: string; message?: string } | null | undefined;
        const errorMsg = data?.error || data?.message || `HTTP error ${response.status}: ${response.statusText}`;
        throw new Error(errorMsg);
    }
    return response;
});

export { api }

