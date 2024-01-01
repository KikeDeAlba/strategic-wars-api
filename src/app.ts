import { Hono } from "https://deno.land/x/hono@v3.11.10/mod.ts"
import { logger, serveStatic } from "https://deno.land/x/hono@v3.11.11/middleware.ts"
import { partyRouter } from "@/app/routers/party.ts";
import { mapsRouter } from "@/app/routers/maps.ts";
import { cors } from "https://deno.land/x/hono@v3.11.11/middleware.ts"
import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { saveError } from "@/lib/errors.ts";

export const app = new Hono()

const readPublic = async (path = './public') => {
    const publicFiles = Deno.readDir(path)
    
    for await (const file of publicFiles) {
        if (file.isFile) {
            // @ts-expect-error - Deno doesn't have a type for this yet
            app.use(`${path.slice(1)}/${file.name}`, serveStatic({path: `${path}/${file.name}`}))
        }

        if (file.isDirectory) {
            await readPublic(`${path}/${file.name}`)
        }

        // console.log(path, file.name)
    }
}

readPublic()

// @ts-expect-error - Deno doesn't have a type for this yet
app.use('*', logger())
// @ts-expect-error - Deno doesn't have a type for this yet
app.use('*', cors({
    origin: '*',
    allowHeaders: ['*'],
    allowMethods: ['*']
}))

app.get('/', (c) => c.text('Hello Deno!'))
app.route('/party', partyRouter)
app.route('/maps', mapsRouter)

app.post('/error', (c) => {
    const err = c.req.query('err')

    const safeErr = z.string().safeParse(err)

    if (!safeErr.success) {
        return c.json({
            'message': 'Invalid error'
        }, 400)
    }

    const error = new Error(safeErr.data)

    saveError(error)

    return c.json({
        'message': 'Error saved'
    })
})