/**
 * IMPORTS
 */

/**
 * GLOBAL VARIABLES
 */

const g__node_asyncFs = require("node:fs/promises");
const g__nodePath = require("node:path");
const g__node_process = require("node:process");
const g__nodeModulesPath = g__nodePath.join(g__node_process.cwd(), "node_modules");

async function Generate__ComponentHTML(componentName, componentScript, testScript) {
    const templatePath = g__nodePath.join(__dirname, "../templates/component.html");
    const reactPath = g__nodeModulesPath + "/react/umd/react.development.js";
    const reactDomPath = g__nodeModulesPath + "/react-dom/umd/react-dom.development.js";

    const [template, reactSource, reactDomSource] = await Promise.all([
        g__node_asyncFs.readFile(templatePath, { encoding: "utf-8" }),
        g__node_asyncFs.readFile(reactPath, { encoding: "utf-8" }),
        g__node_asyncFs.readFile(reactDomPath, { encoding: "utf-8" })
    ]);

    return template
        .replace("{{COMPONENT_NAME}}", componentName)
        .replace("{{REACT_SOURCE}}", reactSource)
        .replace("{{REACT_DOM_SOURCE}}", reactDomSource)
        .replace("{{COMPONENT_SCRIPT}}", componentScript)
        .replace("{{TEST_SCRIPT}}", testScript);
}

module.exports = {
    Generate__ComponentHTML
}
