import { openDatabase } from "../config/db.config"
import { IGlobals } from "../data/types"

export const getGlobals = async (): Promise<IGlobals> => {
    const sql = `SELECT * FROM Global`
    const db = await openDatabase()

    let globals = null
    const rows = await db.all(sql)

    if (rows.length > 0) {
        globals = rows[0]
    } else {
        globals = await createGlobals()
    }

    await db.close()
    return globals
}

const createGlobals = async (): Promise<IGlobals> => {
    const db = await openDatabase()
    const sql = `INSERT INTO Global VALUES (1, null)`

    await db.exec(sql)

    await db.close()
    return await getGlobals()
}

export const setAPIKey = async (newKey: string): Promise<boolean> => {
    const globals: any = await getGlobals();

    const db = await openDatabase()
    try {
        const sql = `UPDATE Global SET ApiId = ? WHERE Global_ID = ?`
        await db.run(sql, newKey, globals.Global_ID)
        return true
    } catch (error) {
        return false
    } finally {
        await db.close()
    }
}

export const removeAPIKey = async (): Promise<boolean> => {
    const globals: any = await getGlobals();
    const db = await openDatabase()
    try {
        const sql = `UPDATE Global SET ApiId = null WHERE Global_ID = ?`
        await db.run(sql, globals.Global_ID)
        return true
    } catch (error) {
        return false
    } finally {
        await db.close()
    }
}