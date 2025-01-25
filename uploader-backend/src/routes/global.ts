import { Router } from 'express'
import { getGlobals, removeAPIKey, setAPIKey } from '../services/global.service'
const router = Router()

router.get("/has-apiKey", async (req, res) => {
    const global: any = await getGlobals()
    res.json(!!global?.ApiId)
})

router.put("/apiKey", async (req, res) => {
    if (!req.body) { throw new Error("NO_KEY_ADDING") }

    const { key } = req.body

    if (!key) { throw new Error("NO_KEY_ADDING") }

    const resp = await setAPIKey(key)
    if (!resp) { throw new Error() }
    else { res.sendStatus(204) }
})

router.delete("/apiKey", async (req, res) => {
    const resp = await removeAPIKey()
    if (!resp) { throw new Error() }
    else { res.sendStatus(204) }
})

export { router as GlobalRouter }