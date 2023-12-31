import { Hono } from "https://deno.land/x/hono@v3.11.10/mod.ts"
import { createParty, joinParty, leaveParty, transferLeader } from "@/lib/party-functions.ts";
import z from "https://deno.land/x/zod@v3.22.4/index.ts";
import { saveError } from "@/lib/errors.ts";
import { streamSSE } from "https://deno.land/x/hono@v3.11.11/helper.ts"
import { db } from "@/services/db.ts";
import { Party } from "@/types/party-types.ts";

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
        const {party, playerId} = await createParty(safeUsername.data)

        return c.json({
            party,
            playerId
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

partyRouter.get('/join/:code', async (c) => {
    const name = c.req.query('username')
    const code = c.req.param('code')

    const safeName = z.string().safeParse(name)

    if (!safeName.success) {
        return c.json({
            'message': 'Invalid name'
        }, 400)
    }

    const { party, playerId } = await joinParty(code, safeName.data)

    return c.json({
        party,
        playerId
    }, 200)
})

partyRouter.delete('/:code/:playerId', async (c) => {
    const code = c.req.param('code')
    const playerId = c.req.param('playerId')

    const party = await leaveParty(code, playerId)

    return c.json({
        party
    }, 200)
})

partyRouter.put('/:code/:playerId', async (c) => {
    const code = c.req.param('code')
    const playerId = c.req.param('playerId')

    const party = await transferLeader(code, playerId)

    return c.json({
        party
    }, 200)
})

partyRouter.get('/events/:code', (c) => {
    const code = c.req.param('code')

    // @ts-expect-error - Hono doesn't have a type for this
    return streamSSE(c, async (stream) => {
        const watcher = db.watch([
            ['party', code]
        ])

        for await (const [party] of watcher) {
            const safeParty = Party.safeParse(party.value)

            if (safeParty.success) {
                await stream.writeSSE({
                    event: 'party-update',
                    data: JSON.stringify(safeParty.data)
                })
            }
        }
    })
})