export interface IGlobals {
    Global_ID: number;
    ApiId: string | null;
}

export interface IQueueElement {
    Upload_ID: number;
    filename: string;
    mimeType: string;
    url: string;
}

export enum API_ENDPOINTS {
    GLOBALS_GET = "/globals",
    GLOBALS_HAS_KEY = "/globals/has-apiKey",
    GLOBALS_APIKEY_ROOT = "/globals/apiKey",

    QUEUE_GET = "/queue",
    QUEUE_FRONT = "/queue/front",
    QUEUE_ADD = "/queue/add",
    QUEUE_REMOVE = "/queue/remove",
    QUEUE_UPLOAD_CURRENT = "/queue/uploadCurrent",
    QUEUE_UPLOAD_CHECK_PROGRESS = "/upload-progress",
}

export const ApiErrors: Record<string, string> = {
    "LIMIT_PART_COUNT": "LIMIT_PART_COUNT",
    "LIMIT_FILE_SIZE": "Archivo demasiado grande",
    "LIMIT_FILE_COUNT": "Demasiados archivos",
    "LIMIT_FIELD_KEY": "Error en la clave del archivo",
    "LIMIT_FIELD_VALUE": "LIMIT_FIELD_VALUE",
    "LIMIT_FIELD_COUNT": "LIMIT_FIELD_COUNT",
    "LIMIT_UNEXPECTED_FILE": "Archivo inesperado",
    "FILE_MISSING": "Sin archivo",
    "GENERIC_ERROR": "Ocurrió un error al procesar la información",
    "EMPTY_QUEUE": "Cola de subida vacia",
    "NO_KEY": "No se ha agregado la Key de Pixeldrain",
    "NO_ID": "No se ha proporcionado un id",
    "NO_KEY_ADDING": "No se ha enviado la Key",
    "TASK_NOT_FOUND": "Tarea no encontrada",
    "OK": "Acción realizada con éxito",
}

export type APIReturn = {
    message: string;
    error: boolean
}