import { Hono } from "https://deno.land/x/hono@v3.11.10/mod.ts"
import { createParty } from "@/lib/party-functions.ts";
import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { saveError } from "@/lib/errors.ts";

export const partyRouter = new Hono()

partyRouter.post('/', async (c) => {
    const username = c.req.query('username')
    const safeUsername = z.string().safeParse(username)

    if (!safeUsername.success) {
        return c.json({
            'message': 'Invalid username'
        }, 400)
    }


    try {
        const code = await createParty(safeUsername.data)

        return c.json({
            'code': code
        }, 201)
    } catch (e) {
        saveError(e)
            .catch(() => {
                // If we can't save the error, we're in big trouble
            })

        return c.json({
            'message': 'Something went wrong'
        }, 400)
    }
})