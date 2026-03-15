/**
 * IMPORTS
 */

/**
 * GLOBAL VARIABLES
 */

const g__node_asyncFs = require("node:fs/promises");
const g__nodePath = require("node:path");

async function Generate__ComponentHTML({script }) {

    const templatePath = g__nodePath.join(__dirname, "../templates/component.html");
    const template = await g__node_asyncFs.readFile(templatePath, { encoding: "utf-8" });

    const allScripts = script.map(s => s.code).join('\n');
    return template.replace("{{COMPONENT_SCRIPT}}", () => allScripts);
}

module.exports = {
    Generate__ComponentHTML
}
