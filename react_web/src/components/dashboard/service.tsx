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
    async deleteBlogApi(id: string) {
      return await apiHandler.delete(`${endpoints.GET_BLOGS}/${id}`);
    }
  };
})();
