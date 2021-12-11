import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import css from "rollup-plugin-import-css";
import sveltePreprocess from "svelte-preprocess";

export default {
    input: "frontend/index.js",
    output: {
        file: "public/bundle.js",
        format: "iife",
    },
    plugins: [
        svelte({
            preprocess: sveltePreprocess(),
        }),
        resolve({ browser: true }),
        css(),
    ],
};
