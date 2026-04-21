import { apiHandler } from "@/utils/apiHandler/service";
import * as endpoints from "@/helper/endpoints";

export class blogService {
  static async getBlogApi(param: string) {
    return await apiHandler.get(`${endpoints.GET_BLOGS}/${param}`);
  }
}
