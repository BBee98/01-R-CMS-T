const g__node_process = require("node:process");
const g__nodePath = require("node:path");
const esBuild = require('esbuild');

const g__nodeModulesPath = g__nodePath.join(g__node_process.cwd(), "node_modules")
const React = require(g__nodeModulesPath + "/react");

const react__Mount = async ({fileName, componentFolder}) => {

    const transpiledCode = await esBuild.build({
        entryPoints: [componentFolder],
        loader: {
            '.js': 'jsx',
        },
        bundle: true,
        write: true,
        platform: 'browser',
        format: "iife",
        outdir: `ssr/client`,
    });

    if(transpiledCode.errors.length > 0) {
        console.error("Transpilation errors: ", transpiledCode.errors, "")
    }
    console.log("transpiledCode", transpiledCode)

}

module.exports = {react__Mount}