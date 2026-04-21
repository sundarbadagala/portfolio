import { apiHandler } from "@/utils/apiHandler/service";
import * as endpoints from "@/helper/endpoints";

export const blogsService = (() => {
  return {
    async getBlogsApi() {
      return await apiHandler.get(endpoints.GET_BLOGS);
    },
    async getTagsApi() {
      return await apiHandler.get(endpoints.GET_TAGS);
    },
    async getNewsApi() {
      return await apiHandler.get(endpoints.GET_NEWS)
    }
  };
})();
