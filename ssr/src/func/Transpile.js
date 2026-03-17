const esBuild = require('esbuild');
const React = require('react');
const g__nodePath = require('node:path');
const g__node_fs = require('node:fs');

const g__testsFolder = g__nodePath.join(__dirname, '../tests');

const g__reactMajorVersion = parseInt(React.version.split('.')[0], 10);
const g__jsxTransform = g__reactMajorVersion >= 17 ? 'automatic' : 'transform';

const Jsx = async ({components, componentFolder}) => {

    const componentName = g__nodePath.basename(componentFolder);
    const runnerFile = g__nodePath.join(g__testsFolder, `run__${componentName}.js`);
    const hasRunner = g__node_fs.existsSync(runnerFile);

    const esBuildOptions = {
        loader: { '.js': 'jsx' },
        jsx: g__jsxTransform,
        bundle: true,
        write: false,
        platform: 'browser',
        format: 'iife',
    };

    if (hasRunner) {
        esBuildOptions.entryPoints = [runnerFile];
    } else {
        const mountCode = `
const _c = require(${JSON.stringify(componentFolder)});
const { createRoot } = require('react-dom/client');
const React = require('react');
const Component = _c.default ?? _c;
createRoot(document.getElementById('root')).render(React.createElement(Component, null));
`;
        esBuildOptions.stdin = { contents: mountCode, resolveDir: componentFolder, loader: 'js' };
    }

    const transpiledCode = await esBuild.build(esBuildOptions);

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
        ...!hasRunner && {mountCode: esBuildOptions.stdin.contents}
    });
}

module.exports = {
    Transpile: {
        Jsx
    }
}