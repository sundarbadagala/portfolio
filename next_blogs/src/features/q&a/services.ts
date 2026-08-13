import { api } from "@/shared/lib/apiHandler";
import { API_QANDA_CATEGORIES, API_QANDA_SUBCATEGORIES, API_QANDA_BY_SUBCATEGORY } from "@/shared/lib/endpoints";
import type { Question, CategoriesResponse, SubCategoriesResponse, QuestionsResponse } from "./types";

export async function getQandACategories(): Promise<string[]> {
  const res = await api.get(API_QANDA_CATEGORIES);
  const data = res.data as CategoriesResponse;
  return data?.data || [];
}

export async function getQandASubCategories(category: string): Promise<string[]> {
  const res = await api.get(API_QANDA_SUBCATEGORIES, {
    params: { category }
  });
  const data = res.data as SubCategoriesResponse;
  return data?.data || [];
}

export async function getQandABySubCategory(subCategory: string): Promise<Question[]> {
  const res = await api.get(API_QANDA_BY_SUBCATEGORY, {
    params: { sub_category: subCategory }
  });
  const data = res.data as QuestionsResponse;
  return data?.data || [];
}
