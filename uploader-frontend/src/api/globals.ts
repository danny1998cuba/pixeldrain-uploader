import { API_ENDPOINTS, ApiErrors, APIReturn } from "./api.types";
import { APIConnection } from "./connection";

export abstract class GlobalsApiConector {
    static async hasAPIKey(): Promise<boolean> {
        const res = await APIConnection.getInstance().get(API_ENDPOINTS.GLOBALS_HAS_KEY, { validateStatus(_status) { return true } })
        return res.data
    }

    static async setApiKey(key: string): Promise<APIReturn> {
        const res = await APIConnection.getInstance().put(API_ENDPOINTS.GLOBALS_APIKEY_ROOT, { key }, { validateStatus(_status) { return true } })
        return res.status === 204 ?
            { message: ApiErrors.OK, error: false } :
            { message: ApiErrors[res?.data?.code as string || 'GENERIC_ERROR'], error: true }
    }

    static async removeApiKey(): Promise<APIReturn> {
        const res = await APIConnection.getInstance().delete(API_ENDPOINTS.GLOBALS_APIKEY_ROOT, { validateStatus(_status) { return true } })
        return res.status === 204 ?
            { message: ApiErrors.OK, error: false } :
            { message: ApiErrors[res?.data?.code as string || 'GENERIC_ERROR'], error: true }
    }
}