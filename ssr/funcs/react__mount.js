const esBuild = require('esbuild');
const React = require('react');

const g__reactMajorVersion = parseInt(React.version.split('.')[0], 10);
const g__jsxTransform = g__reactMajorVersion >= 17 ? 'automatic' : 'transform';

const react__Mount = async ({components, componentFolder}) => {

    const mountCode = `
const _c = require(${JSON.stringify(componentFolder)});
const { createRoot } = require('react-dom/client');
const React = require('react');
const Component = _c.default ?? _c;
createRoot(document.getElementById('root')).render(React.createElement(Component, null));
`;

    const transpiledCode = await esBuild.build({
        stdin: {
            contents: mountCode,
            resolveDir: componentFolder,
            loader: 'js',
        },
        loader: {
            '.js': 'jsx',
        },
        jsx: g__jsxTransform,
        bundle: true,
        write: false,
        platform: 'browser',
        format: "iife",
    });

    if (transpiledCode.errors.length > 0) {
        console.error("[react__mount] Errors:", transpiledCode.errors)
    }

    if (transpiledCode.warnings.length > 0) {
        console.warn("[react__mount] Warnings:", transpiledCode.warnings)
    }

    if (transpiledCode.outputFiles.length === 0) {
        console.info("[react__mount] No output files generated");
        return;
    }

    const bundleText = transpiledCode.outputFiles[0].text;
    components.push({
        code: bundleText,
        mountCode,
    });
}

module.exports = {react__Mount}