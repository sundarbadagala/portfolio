import { apiHandler } from "@/utils/apiHandler/service";
import * as endpoints from '@/helper/endpoints'

export const loginService = (() => {
    return {
        async loginApi(payload: any) {
            return await apiHandler.post(endpoints.LOGIN_ADMIN, { payload })
        }
    }
})()