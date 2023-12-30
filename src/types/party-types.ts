import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

export const PartyMember = z.object({
    id: z.string(),
    name: z.string()
})

export const Party = z.object({
    code: z.string(),
    members: z.object({
        leader: PartyMember,
        others: z.array(PartyMember)
    })
})