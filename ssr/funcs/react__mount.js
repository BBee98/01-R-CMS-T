const esBuild = require('esbuild');

const react__Mount = async ({components, componentFolder}) => {

    const transpiledCode = await esBuild.build({
        entryPoints: [componentFolder],
        loader: {
            '.js': 'jsx',
        },
        bundle: true,
        write: false,
        platform: 'browser',

        format: "iife",
    });

    if (transpiledCode.errors.length > 0) {
        console.error("Transpilation errors: ", transpiledCode.errors, "")
    }

    if (transpiledCode.outputFiles.length === 0) {
        console.info("No output files generated");
        return;
}
    components.push(transpiledCode.outputFiles[0].text);
}

module.exports = {react__Mount}