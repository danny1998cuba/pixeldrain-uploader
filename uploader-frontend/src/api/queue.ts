import { API_ENDPOINTS, ApiErrors, APIReturn, IQueueElement } from "./api.types";
import { APIConnection } from "./connection";

export abstract class QueueApiConector {
    static async getQueue(): Promise<IQueueElement[]> {
        const res = await APIConnection.getInstance().get(API_ENDPOINTS.QUEUE_GET, { validateStatus(_status) { return true } })
        return res.data
    }
    static async getQueueFront(): Promise<IQueueElement> {
        const res = await APIConnection.getInstance().get(API_ENDPOINTS.QUEUE_FRONT, { validateStatus(_status) { return true } })
        return res.data
    }

    static async uploadCurrent(): Promise<APIReturn> {
        const res = await APIConnection.getInstance().get(API_ENDPOINTS.QUEUE_UPLOAD_CURRENT, { validateStatus(_status) { return true } })
        return res.status === 200 ?
            { message: res.data.taskId, error: false } :
            { message: ApiErrors[res?.data?.code as string || 'GENERIC_ERROR'], error: true }
    }

    static async checkUploadState(taskId: string): Promise<APIReturn> {
        const res = await APIConnection.getInstance().get(`${API_ENDPOINTS.QUEUE_UPLOAD_CHECK_PROGRESS}/${taskId}`, { validateStatus(_status) { return true } })
        return res.status === 200 ?
            { message: res.data.status, error: false } :
            { message: ApiErrors[res?.data?.code as string || 'GENERIC_ERROR'], error: true }
    }

    static async removeFromQueue(id: number): Promise<APIReturn> {
        const res = await APIConnection.getInstance().delete(`${API_ENDPOINTS.QUEUE_REMOVE}/${id}`, { validateStatus(_status) { return true } })
        return res.status === 204 ?
            { message: ApiErrors.OK, error: false } :
            { message: ApiErrors[res?.data?.code as string || 'GENERIC_ERROR'], error: true }
    }
}