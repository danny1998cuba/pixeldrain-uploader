import { Database } from 'sqlite3'
import { open } from 'sqlite'
import path from 'path';

const database_name = "./uploader.db";

export const openDatabase = async () => {
    return await open({
        filename: database_name,
        driver: Database
    })
}