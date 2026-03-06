/**
 * IMPORTS
 */

/**
 * GLOBAL VARIABLES
 */

const g__node_asyncFs = require("node:fs/promises");
const g__nodeFs = require("node:fs");
const g__nodePath = require("node:path");
const g__node_process = require("node:process");
const g__nodeModulesPath = g__nodePath.join(g__node_process.cwd(), "node_modules");

// async function Generate__ComponentHTML({componentName, componentScript, testScript}) {
async function Generate__ComponentHTML({componentName, componentScript }) {

    const opt1 = "umd";
    const opt2 = "cjs";
    const reactPath = (parentFolder) => `${g__nodeModulesPath + `/react/${parentFolder}/react.development.js`}`
    const reactDomPath = (parentFolder) => `${g__nodeModulesPath + `/react-dom/${parentFolder}/react-dom.development.js`}`

    const templatePath = g__nodePath.join(__dirname, "../templates/component.html");
    const _reactPath = g__nodeFs.existsSync(reactPath(opt1)) ? reactPath(opt1) : reactPath(opt2);
    const _reactDomPath = g__nodeFs.existsSync(reactDomPath(opt1)) ? reactDomPath(opt1) : reactDomPath(opt2);

    const [template, reactSource, reactDomSource] = await Promise.all([
        g__node_asyncFs.readFile(templatePath, { encoding: "utf-8" }),
        g__node_asyncFs.readFile(_reactPath, { encoding: "utf-8" }),
        g__node_asyncFs.readFile(_reactDomPath, { encoding: "utf-8" })
    ]);

    return template
        .replace("{{COMPONENT_NAME}}", componentName)
        .replace("{{REACT_SOURCE}}", reactSource)
        .replace("{{REACT_DOM_SOURCE}}", reactDomSource)
        .replace("{{COMPONENT_SCRIPT}}", componentScript)
        // .replace("{{TEST_SCRIPT}}", testScript);
}

module.exports = {
    Generate__ComponentHTML
}
