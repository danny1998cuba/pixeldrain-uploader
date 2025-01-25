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