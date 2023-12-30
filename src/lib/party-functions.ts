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

    return code
}

export const joinParty = async (code: string, name: string) => {
    const party = await db.get(['party', code])
    const partyParse = Party.parse(party)

    const member = {
        id: crypto.randomUUID(),
        name
    }

    partyParse.members.others.push(member)

    await db.set(['party', code], party)

    return partyParse
}

export const leaveParty = async (code: string, memberId: string) => {
    const party = await db.get(['party', code])
    const partyParse = Party.parse(party)

    partyParse.members.others = partyParse.members.others.filter(member => member.id !== memberId)

    await db.set(['party', code], party)

    return partyParse
}

export const transferLeader = async (code: string, memberId: string) => {
    const party = await db.get(['party', code])
    const partyParse = Party.parse(party)

    const oldLeader = partyParse.members.leader
    const newLeader = partyParse.members.others.find(member => member.id === memberId)

    if (newLeader) {
        partyParse.members.leader = newLeader
        partyParse.members.others = partyParse.members.others.filter(member => member.id !== memberId)
        partyParse.members.others.push(oldLeader)
    }

    await db.set(['party', code], party)

    return partyParse
}