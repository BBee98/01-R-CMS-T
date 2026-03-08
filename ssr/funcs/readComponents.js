/**
 * IMPORTS
 */

const {g__envs, g__rootFile} = require("./readEnvs");


/**
 * GLOBAL VARIABLES
 */

const g__node_asyncFs = require("node:fs/promises");
const g__node_fs = require("node:fs");
const g__nodePath = require("node:path");
const g__node_process = require("node:process");
const g__nodeModulesPath = g__nodePath.join(g__node_process.cwd(), "node_modules")
const React = require(g__nodeModulesPath + "/react");
const node_childProcess = require("node:child_process");

/**
 * TODO remove when convert into independent library
 */
const sucrase = require(g__nodeModulesPath + "/sucrase");

/**
 *
 */

async function Prepare__Components() {
    const fileComponents = await Read__folderComponents();
    if (!fileComponents) {
        throw new Error("Missing components folder. Please provide a components folder with your components")
    }
    const components = await Read__fileComponents(fileComponents);
    return await Mount__Components(components);
}

async function Read__fileComponents(fileComponents) {
    const components = [];
    return new Promise(async (resolve) => {
        for (const file of fileComponents) {
            const fileDirectory = `${file.parentPath}/${file.name}`;
            const code = await g__node_asyncFs.readFile(fileDirectory, {encoding: "utf-8"});
            components.push({
                name: file.name,
                code
            });
        }
        resolve(components);
    })
}

async function Read__folderComponents() {
    const hasComponentsFile = !!g__envs.REPOSITORY_COMPONENTS_FILE;
    const components = [];

    if (hasComponentsFile) {
        const componentsFolder = `${g__rootFile}/src/${g__envs.REPOSITORY_COMPONENTS_FOLDER}/${g__envs.REPOSITORY_COMPONENTS_FILE}`;
        Fetch__fileComponents(components, componentsFolder);
    } else {
        const componentsFolder = `${g__rootFile}/src/${g__envs.REPOSITORY_COMPONENTS_FOLDER}`;
        Fetch__folderComponents(components, componentsFolder);
    }
    return components;
}

function Mount__Components(components) {
    const componentsMounted = []
    return new Promise(async (resolve) => {
        for (const component of components) {
            const result = sucrase.transform(component.code, {transforms: ["jsx", "typescript", "imports"]});
            await node_childProcess.execSync(`parcel build ${g__envs.URL_COMPONENTS_FILE} --dist-dir ssr/client/dist/components --no-source-maps`);
            const reactComponent = React.createElement(result.code);
            if (!!reactComponent)
                componentsMounted.push({
                    name: component.name,
                    source: result.code
                });
        }
        return resolve(componentsMounted);
    });
}

async function Fetch__folderComponents(components, componentsFolder) {

    const files = await g__node_asyncFs.readdir(componentsFolder, {withFileTypes: true});
    if (!files || files?.length === 0) {
        throw new Error("No components found");
    }
    return new Promise(async (resolve) => {
        for (const file of files) {
            if (file.isDirectory()) {
                const componentFolder = `${file.parentPath}/${file.name}`;
                const filesFromFolder = await g__node_asyncFs.readdir(componentFolder, {withFileTypes: true});
                for (const f of filesFromFolder) {
                    const {name, ...props} = f;
                    if (name.endsWith(".tsx") || name.endsWith(".ts") || name.endsWith(".jsx") || name.endsWith(".js") || name.endsWith(".css")) {
                        components.push({
                            name: name,
                            ...props
                        });
                    }
                }
            }
        }
        return resolve(components)
    });
}

async function Fetch__fileComponents(components, componentsFolder) {
    if(!g__node_fs.existsSync(componentsFolder)){
        const name = g__envs.REPOSITORY_COMPONENTS_FILE;
        const errorMsg = `File ${name} do not exists.`
        if (name.endsWith(".tsx") || name.endsWith(".ts") || name.endsWith(".jsx") || name.endsWith(".js")) {
            throw new Error(errorMsg)
        } else {
            throw new Error(`${errorMsg}. Make sure file name ends with .tsx, .ts, .jsx or .js`)
        }
    }

    const file = await g__node_asyncFs.readFile(componentsFolder, {encoding: "utf-8"});
    if (file.length === 0) {
        throw new Error("No components found");
    }
    const {name, ...props} = file;
    if (name.endsWith(".tsx") || name.endsWith(".ts") || name.endsWith(".jsx") || name.endsWith(".js") || name.endsWith(".css")) {
        components.push({
            name: name,
            ...props
        });
    }
}

module.exports = {
    Prepare__Components
}