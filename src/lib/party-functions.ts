import { db } from "db";

// @ts-expect-error - Deno doesn't know about zod
import { Party } from '@types/party-types.ts'

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

const generateUniqueCode = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }
    return code;
}