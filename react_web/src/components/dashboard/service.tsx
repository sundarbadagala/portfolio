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
      return await apiHandler.get(`${endpoints.POST_QANDA}/${id}`);
    },
    async postQandAAPi(payload: any) {
      return await apiHandler.post(endpoints.POST_QANDA, { payload });
    },
    async updateQandAAPi(id: string, payload: any) {
      return await apiHandler.put(`${endpoints.POST_QANDA}/${id}`, { payload });
    },
  };
})();
