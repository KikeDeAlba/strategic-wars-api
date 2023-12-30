import { db } from "@/services/db.ts";

export const saveError = async (e: Error) => {
    const {value} = await db.get(['error-log'])

    const errorLog = Array.isArray(value) ? value : []

    errorLog.push({
        error: e,
        time: Date.now()
    })

    await db.set(['error-log'], errorLog)
}