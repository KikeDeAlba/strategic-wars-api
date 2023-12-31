import { Hono } from "https://deno.land/x/hono@v3.11.10/mod.ts"
import { logger, serveStatic } from "https://deno.land/x/hono@v3.11.11/middleware.ts"
import { partyRouter } from "@/app/routers/party.ts";
import { mapsRouter } from "@/app/routers/maps.ts";

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

app.get('/', (c) => c.text('Hello Deno!'))
app.route('/party', partyRouter)
app.route('/maps', mapsRouter)