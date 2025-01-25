import { openDatabase } from "../config/db.config";

const sql_create = `CREATE TABLE IF NOT EXISTS Global (
    Global_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    ApiId VARCHAR(100)
  );`;


(async () => {
    const db = await openDatabase()
    try {
        await db.exec(sql_create)
        console.log("Successful creation of the 'Global' table");
    } catch (err) {
        if (err) {
            return console.error(err);
        }
    }
})()