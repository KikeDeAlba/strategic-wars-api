import { db } from "@/services/db.ts";
import { Party } from '@/types/party-types.ts'
import { generateUniqueCode } from "@/utils/generate-codes.ts";

export const createParty = async (leaderName: string) => {
    const code = generateUniqueCode()
    const leader = {
        id: crypto.randomUUID(),
        name: leaderName
    }

    const party = Party.parse({
        code,
        members: {
            leader,
            others: []
        }
    })

    await db.set(['party', code], party)
}

