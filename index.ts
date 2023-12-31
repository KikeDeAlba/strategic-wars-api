import { app } from "./src/app.ts";
import * as fs from "https://deno.land/std@0.210.0/fs/mod.ts";

fs.ensureDir("./public")
    .catch((err) => {
        console.error(err)
    })

Deno.serve({
    port: 3001
}, app.fetch)
