import { apiHandler } from "@/utils/apiHandler/service";
import * as endpoints from "@/helper/endpoints";

export const blogsService = (() => {
  return {
    async getBlogsApi() {
      return await apiHandler.get(endpoints.GET_BLOGS);
    },
    async getBlogApi(contentId: string) {
      return await apiHandler.get(`${endpoints.GET_BLOGS}/${contentId}`);
    },
    async getTagsApi() {
      return await apiHandler.get(endpoints.GET_TAGS);
    },
    async getNewsApi() {
      return await apiHandler.get(endpoints.GET_NEWS);
    },
    async getAllTags() {
      return await apiHandler.get(endpoints.GET_ALL_TAGS);
    },
    async getGroupByTags() {
      return await apiHandler.get(endpoints.GET_GROUPBY_TAGS);
    },
    async deleteBlogApi(id: string) {
      return await apiHandler.delete(`${endpoints.GET_BLOGS}/${id}`, { payload: { id } });
    },
    async updateBlogApi(id: string, payload: any) {
      return await apiHandler.put(`${endpoints.GET_BLOGS}/${id}`, { payload });
    },
    async postBlogApi(payload: any) {
      return await apiHandler.post(`${endpoints.GET_BLOGS}`, { payload });
    },
  };
})();

export const QandAService = (() => {
  return {
    async getQandAApi(id: string) {
      console.log("Mock getQandAApi for ID:", id);
      return { status: 200, data: { data: null } };
    },
    async postQandAAPi(payload: any) {
      console.log("Mock postInterviewApi with payload:", payload);
      return { status: 200, data: { message: "Success" } };
    },
    async updateQandAAPi(id: string, payload: any) {
      console.log("Mock updateInterviewApi with ID:", id, "payload:", payload);
      return { status: 200, data: { message: "Success" } };
    },
  };
})();
