import { Hono } from "https://deno.land/x/hono@v3.11.10/mod.ts";

export const mapsRouter = new Hono()

mapsRouter.get('/', async (c) => {
    const maps = await Deno.readDir('./public/maps')

    const mapList = []

    for await (const map of maps) {
        const mapInfo = await Deno.readTextFile(`./public/maps/${map.name}/info.json`)
        mapList.push(JSON.parse(mapInfo))
    }

    return c.json(mapList)
})

