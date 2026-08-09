import { api } from "@/shared/lib/apiHandler";
import { API_FILTERS_TAGS, API_FILTERS_GROUPBY } from "@/shared/lib/endpoints";

interface TagObject {
  value: string;
  label: string;
}

export type Tag = TagObject | string;

export async function getAllContentTags(): Promise<Tag[]> {
  const res = await api.get(API_FILTERS_TAGS);
  const data = res.data as any;
  return Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : [];
}

export async function getGroupByTags(): Promise<string[]> {
  const res = await api.get(API_FILTERS_GROUPBY);
  const data = res.data as any;
  return Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : [];
}
