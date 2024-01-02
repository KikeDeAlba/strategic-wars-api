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
        },
        started: false
    })

    await db.set(['party', code], party)

    return {
        party,
        playerId: leader.id
    }
}

export const joinParty = async (code: string, name: string) => {
    const {value} = await db.get(['party', code])
    const party = Party.parse(value)

    const member = {
        id: crypto.randomUUID(),
        name
    }

    party.members.others.push(member)

    await db.set(['party', code], party)

    return {
        party,
        playerId: member.id
    }
}

export const leaveParty = async (code: string, memberId: string) => {
    const {value} = await db.get(['party', code])
    const party = Party.parse(value)

    party.members.others = party.members.others.filter(member => member.id !== memberId)

    await db.set(['party', code], party)

    return party
}

export const transferLeader = async (code: string, memberId: string) => {
    const { value } = await db.get(['party', code])
    const party = Party.parse(value)

    const oldLeader = party.members.leader
    const newLeader = party.members.others.find(member => member.id === memberId)

    if (newLeader) {
        party.members.leader = newLeader
        party.members.others = party.members.others.filter(member => member.id !== memberId)
        party.members.others.push(oldLeader)
    }

    await db.set(['party', code], party)

    return party
}