

import { Program } from "./src/program";
import { parseArgs } from "util";

(async function() {
    const time = performance.now();
    try {
        const {values, positionals} = parseArgs({
            args: Bun.argv.slice(2),
            allowPositionals: true
        }), res = await Program.main(values, positionals);
        console.log(`- gmrt-ts execution completed in ${Math.round(performance.now() - time)}ms`);
        process.exit(res);
    } catch (e: any) {
        console.error(`! gmrt-ts execution failed, an exception was thrown: "${(e?.message ?? e)}"`);
        process.exit(1);
    }
})();