const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type FetchOptions = RequestInit & {
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export async function http<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(
        `API error ${res.status}: ${res.statusText} — ${endpoint}`,
      );
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(
        `Invalid content type: ${contentType} for endpoint ${endpoint}`,
      );
    }

    return res.json() as Promise<T>;
  } catch (error) {
    console.error(`HTTP request failed for endpoint: ${endpoint}`, error);
    throw error;
  }
}
