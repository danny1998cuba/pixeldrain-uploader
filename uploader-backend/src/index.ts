import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors'
import fs from 'fs'
import './config/db.config'
import './data'
import { GlobalRouter } from './routes/global';
import bodyParser from 'body-parser';
import multer from 'multer'
import { addToQueue, getCuerrentQueueElement, getQueue, getQueueElement, removeFromQueue } from './services/queue.service';
import { getGlobals } from './services/global.service';
import { v4 } from 'uuid'
import path from 'path';

const app = express();
const port = 3250;

const progressTracker: Record<string, { status: 'in-progress' | 'completed' | 'failed' }> = {};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
        cb(null, v4() + "_" + file.originalname)
    },
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 250 * 1024 * 1024,
    },
})

app.use(cors())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));

app.use('/globals', GlobalRouter);

app.get('/queue', async (req, res) => {
    res.json(await getQueue())
});

app.get('/queue/front', async (req, res) => {
    res.json(await getCuerrentQueueElement())
});

app.post("/queue/add", upload.single('file'), async (req, res) => {
    const f = req.file as Express.Multer.File
    if (f) {
        const resp = await addToQueue({ filename: f.originalname, url: f.path, mimeType: f.mimetype })
        res.sendStatus(204)
    } else {
        throw new Error("FILE_MISSING")
    }
})

app.delete("/queue/remove/:id", async (req, res) => {
    if (req.params.id && !isNaN(parseInt(req.params.id))) {
        const elem = await getQueueElement(parseInt(req.params.id))
        await removeFromQueue(parseInt(req.params.id))

        if (fs.existsSync(elem.url)) {
            fs.rmSync(elem.url)
        }

        res.sendStatus(204)
    } else {
        throw new Error("NO_ID")
    }
})

app.get('/queue/uploadCurrent', async (req, res) => {
    const globals = await getGlobals()

    if (!globals.ApiId) {
        throw new Error("NO_KEY")
    } else {
        const current = await getCuerrentQueueElement()

        if (current) {
            const file = fs.readFileSync(current.url)

            const taskId = v4(); // Generate a unique task ID
            progressTracker[taskId] = { status: 'in-progress' };

            const uploadFile = async () => {
                try {
                    const cloudStorageUrl = 'https://pixeldrain.com/api/file'; // Replace with actual URL

                    const formData = new FormData()
                    formData.set('name', current.filename)
                    formData.set('file', new File([file], current.filename, { type: current.mimeType }))

                    const response = await fetch(cloudStorageUrl, {
                        method: 'POST',
                        headers: {
                            "Authorization": "Basic " + btoa(":" + globals.ApiId),
                        },
                        body: formData,
                    });

                    if (response.ok) {
                        progressTracker[taskId].status = 'completed';

                        if (fs.existsSync(current.url)) {
                            fs.rmSync(current.url)
                        }

                        await removeFromQueue(current.Upload_ID)
                    } else {
                        console.error(response.statusText)
                        console.error(await response.json())
                        progressTracker[taskId].status = 'failed';
                    }
                } catch (error) {
                    console.error("catch")
                    console.error(error)
                    progressTracker[taskId].status = 'failed';
                }
            };

            uploadFile(); // Start the upload process asynchronously
            res.json({ taskId });
        } else {
            res.statusCode = 500
            res.send({ code: "EMPTY_QUEUE" })
        }
    }
});

app.get('/upload-progress/:taskId', (req, res) => {
    const { taskId } = req.params;
    const task = progressTracker[taskId];
    if (task) {
        res.json(task);
    } else {
        throw new Error("TASK_NOT_FOUND")
    }
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        res.statusCode = 400
        res.send({ code: err.code })
    } else if (err) {
        if (err.message === "FILE_MISSING" || err.message === "INVALID_TYPE" || err.message === "NO_KEY_ADDING" || err.message === "NO_ID") {
            res.statusCode = 400
            res.send({ code: err.message })
        } else if (err.message === "EMPTY_QUEUE" || err.message === "NO_KEY") {
            res.statusCode = 500
            res.send({ code: err.message })
        } else if (err.message === "TASK_NOT_FOUND") {
            res.statusCode = 404
            res.send({ code: err.message })
        } else {
            res.statusCode = 500
            res.send({ code: "GENERIC_ERROR" })
        }
    }
});

app.use(express.static('public'));
app.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get("*", (req, res) => res.redirect("/"))

app.listen(port, () => {
    if (!fs.existsSync("./uploads/")) {
        fs.mkdirSync("./uploads")
    }

    console.log(`Server is running on http://localhost:${port}`);
});
