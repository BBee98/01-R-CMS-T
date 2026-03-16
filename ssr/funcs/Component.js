const {Fetch} = require("./Fetch");
const { g__nodePath, g__node_asyncFs, g__envs, g__rootFile } = require("./constants");

async function Get() {
    const components = []
    const hasComponentsFile = !!g__envs.REPOSITORY_COMPONENTS_FILE;

    if (hasComponentsFile) {
        const componentsFolder = `${g__rootFile}/src/${g__envs.REPOSITORY_COMPONENTS_FOLDER}/${g__envs.REPOSITORY_COMPONENTS_FILE}`;
        await Fetch.Components.byFile(components, componentsFolder);
    } else {
        const componentsFolder = `${g__rootFile}/src/${g__envs.REPOSITORY_COMPONENTS_FOLDER}`;
        await Fetch.Components.byFolder(components, componentsFolder);
    }
    return components;
}

async function toHTML({script}) {
    const templatePath = g__nodePath.join(__dirname, "../templates/component.html");
    const template = await g__node_asyncFs.readFile(templatePath, { encoding: "utf-8" });

    const allScripts = script.map(s => s.code).join('\n');
    return template.replace("{{COMPONENT_SCRIPT}}", () => allScripts);
}

module.exports = {
        Get,
        toHTML
}