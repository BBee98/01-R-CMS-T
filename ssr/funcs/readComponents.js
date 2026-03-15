/**
 * IMPORTS
 */

const {g__envs, g__rootFile} = require("./readEnvs");


/**
 * GLOBAL VARIABLES
 */

const g__node_asyncFs = require("node:fs/promises");
const g__node_fs = require("node:fs");

const {react__Mount} = require("./react__mount");

async function Prepare__Components() {
    await Get__Components();
}

async function Get__Components() {
    const hasComponentsFile = !!g__envs.REPOSITORY_COMPONENTS_FILE;

    if (hasComponentsFile) {
        const componentsFolder = `${g__rootFile}/src/${g__envs.REPOSITORY_COMPONENTS_FOLDER}/${g__envs.REPOSITORY_COMPONENTS_FILE}`;
        await Fetch__fileComponents(componentsFolder);
    } else {
        const componentsFolder = `${g__rootFile}/src/${g__envs.REPOSITORY_COMPONENTS_FOLDER}`;
        await Fetch__folderComponents(componentsFolder);
    }
}

async function Fetch__folderComponents(componentsFolder) {

    const files = await g__node_asyncFs.readdir(componentsFolder, {withFileTypes: true});
    if (!files || files?.length === 0) {
        throw new Error("No components found");
    }
    for (const file of files) {
        if (file?.isDirectory()) {
            const componentFolder = `${file.parentPath}/${file.name}`;
            const filesFromFolder = await g__node_asyncFs.readdir(componentFolder, {withFileTypes: true});
            for (const f of filesFromFolder) {
                const {name, parentPath} = f;
                if (name.endsWith(".tsx") || name.endsWith(".ts") || name.endsWith(".jsx") || name.endsWith(".js") || name.endsWith(".css")) {
                    await react__Mount({
                        fileName: name,
                        componentFolder: parentPath,
                    });
                }
            }
        }
    }
}

async function Fetch__fileComponents(components, componentsFolder) {

    // TODO instead of throwing an error at first attempt ask for fetch all directories
    const name = g__envs.REPOSITORY_COMPONENTS_FILE;

    if (!g__node_fs.existsSync(componentsFolder)) {
        const errorMsg = `File ${name} do not exists.`
        if (name?.endsWith(".tsx") || name?.endsWith(".ts") || name?.endsWith(".jsx") || name?.endsWith(".js")) {
            throw new Error(errorMsg)
        } else {
            throw new Error(`${errorMsg}. Make sure file name ends with .tsx, .ts, .jsx or .js`)
        }
    }

    const file = await g__node_asyncFs.readFile(componentsFolder, {encoding: "utf-8"});
    if (file.length === 0) {
        throw new Error("No components found");
    }
    await react__Mount({fileName: name, componentFolder: componentsFolder});
}


module.exports = {
    Prepare__Components
}