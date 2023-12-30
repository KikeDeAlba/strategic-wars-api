import { Hono } from "https://deno.land/x/hono@v3.11.10/mod.ts"
import { logger } from "https://deno.land/x/hono@v3.11.11/middleware.ts"

export const app = new Hono()

// @ts-expect-error - Deno doesn't have a type for this yet
app.use('*', logger())

app.get('/', (c) => c.text('Hello Deno!'))