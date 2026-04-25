const BASE_URL = process.env.API_BASE_URL ?? "https://api-node-82xn.onrender.com/api/v1";

type FetchOptions = RequestInit & {
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export async function http<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    cache: "no-store",
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText} — ${endpoint}`);
  }

  return res.json() as Promise<T>;
}
