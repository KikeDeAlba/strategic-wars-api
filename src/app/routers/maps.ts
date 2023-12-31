import { Hono } from "https://deno.land/x/hono@v3.11.10/mod.ts";

export const mapsRouter = new Hono()

mapsRouter.get('/', async (c) => {
    const maps = await Deno.readDir('./public/maps')

    const mapList = ['']

    for await (const map of maps) {
        Deno.readTextFile(`./public/maps/${map.name}`)
            .then((mapData) => {
                mapList.push(JSON.parse(mapData))
            })
    }

    return c.json(mapList)
})

