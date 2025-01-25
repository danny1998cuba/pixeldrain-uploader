import axios, { AxiosInstance } from "axios";

export abstract class APIConnection {
    private static url = "/"

    private static axiosInstance: AxiosInstance | undefined;

    public static getInstance(): AxiosInstance {
        if (!this.axiosInstance) {

            this.axiosInstance = axios.create({
                baseURL: `${this.url}`,
            });
        }

        return this.axiosInstance
    }
}