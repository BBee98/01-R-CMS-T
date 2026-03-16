const {g__envs, g__node_asyncFs, g__node_fs} = require("./constants");
const {Transpile} = require("./Transpile");

async function byFile(components, componentsFolder) {

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
    await Transpile.Jsx({components, componentFolder: componentsFolder});
}

async function byFolder(components, componentsFolder) {
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
                    await Transpile.Jsx({
                        components,
                        componentFolder: parentPath,
                    });
                }
            }
        }
    }
    return components;
}


module.exports = {
    Fetch: {
        Components: {
            byFile,
            byFolder
        }
    }
};