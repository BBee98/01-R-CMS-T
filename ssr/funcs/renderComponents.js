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
const reactDistImport = g__nodePath.join(g__node_process.cwd(), "ssr/client/dist");

// async function Generate__ComponentHTML({componentName, componentScript, testScript}) {
async function Generate__ComponentHTML({componentName, componentScript }) {

    const templatePath = g__nodePath.join(__dirname, "../templates/component.html");
    const reactPath = () => {
        if(!g__nodeFs.existsSync(reactDistImport)){
            throw new Error("Missing react dist folder from react.")
        }
        return g__nodePath.join(reactDistImport, "globals.js");
    }

    const [template, reactSource] = await Promise.all([
        g__node_asyncFs.readFile(templatePath, { encoding: "utf-8" }),
        g__node_asyncFs.readFile(reactPath(), { encoding: "utf-8" }),
    ]);

    return template
        .replace("{{COMPONENT_NAME}}", componentName)
        .replace("{{REACT_SOURCE}}", reactSource)
        .replace("{{COMPONENT_SCRIPT}}", componentScript)
        // .replace("{{TEST_SCRIPT}}", testScript);
}

module.exports = {
    Generate__ComponentHTML
}
