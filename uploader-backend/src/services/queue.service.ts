import { openDatabase } from "../config/db.config"
import { IQueueElement } from "../data/types"

export const getQueue = async (): Promise<IQueueElement[]> => {
    const sql = `SELECT * FROM UploadQueue`
    const db = await openDatabase()

    const rows = await db.all(sql)
    await db.close()
    return rows
}

export const getCuerrentQueueElement = async (): Promise<IQueueElement | null> => {
    const sql = `SELECT * FROM UploadQueue ORDER BY Upload_ID ASC`
    const db = await openDatabase()

    const rows = await db.all(sql)
    await db.close()

    return rows?.[0] || null
}

export const getQueueElement = async (id: number): Promise<IQueueElement> => {
    const sql = `SELECT * FROM UploadQueue WHERE Upload_ID = ?`
    const db = await openDatabase()

    const rows = await db.get(sql, id)
    await db.close()

    return rows
}

export const addToQueue = async (data: {
    filename: string;
    mimeType: string;
    url: string;
}): Promise<boolean> => {
    const db = await openDatabase()
    try {
        const sql = `INSERT INTO UploadQueue (filename, mimeType, url) VALUES ('${data.filename}', '${data.mimeType}', '${data.url.replace("\\", '/')}')`
        await db.exec(sql)
        return true
    } catch (error) {
        return false
    } finally {
        await db.close()
    }
}

export const removeFromQueue = async (id: number): Promise<boolean> => {
    const db = await openDatabase()
    try {
        const sql = `DELETE FROM UploadQueue WHERE Upload_ID = ?`
        await db.run(sql, id)
        return true
    } catch (error) {
        return false
    } finally {
        await db.close()
    }
}