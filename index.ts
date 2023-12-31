import { app } from "./src/app.ts";

Deno.mkdir('./public', { recursive: true })

Deno.serve({
    port: 3001
}, app.fetch)
