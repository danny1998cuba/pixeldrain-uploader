import { openDatabase } from "../config/db.config";

const sql_create = `CREATE TABLE IF NOT EXISTS UploadQueue (
    Upload_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    filename VARCHAR(100) NOT NULL,
    mimeType VARCHAR(100) NOT NULL,
    url VARCHAR(100) NOT NULL
);`;

(async () => {
    const db = await openDatabase()
    try {
        await db.exec(sql_create)
        console.log("Successful creation of the 'UploadQueue' table");
    } catch (err) {
        if (err) {
            return console.error(err);
        }
    }
})()