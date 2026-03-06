/**
 * IMPORTS
 */

const { g__envs, g__rootFile } = require("./readEnvs");

/**
 * GLOBAL VARIABLES
 */

const g__node_asyncFs = require("node:fs/promises");
const g__nodePath = require("node:path");
const g__node_process = require("node:process");
const g__nodeModulesPath = g__nodePath.join(g__node_process.cwd(), "node_modules")
const React = require(g__nodeModulesPath + "/react");

/**
 * TODO remove when convert into independent library
 */
const sucrase = require(g__nodeModulesPath + "/sucrase");
/**
 *
 */

async function Prepare__Components(){
    const fileComponents = await Read__folderComponents();
    if(!fileComponents){
        throw new Error("Missing components folder. Please provide a components folder with your components")
    }
    const components = await Read__fileComponents(fileComponents);
    return await Mount__Components(components);
}

async function Read__fileComponents(fileComponents){
    const components = [];
    return new Promise(async (resolve) => {
        for (const file of fileComponents) {
            const fileDirectory = `${file.parentPath}/${file.name}`;
            console.log("file", file)
            const code = await g__node_asyncFs.readFile(fileDirectory, { encoding: "utf-8"});
            components.push({
                name: file.name,
                code
            });
        }
        resolve(components);
    })
}

async function Read__folderComponents(){
    const componentsFolder = `${g__rootFile}/src/${g__envs.REPOSITORY_COMPONENTS_FOLDER}`;
    const files = await g__node_asyncFs.readdir(componentsFolder, {withFileTypes: true});
    if(!files || files?.length === 0){
        throw new Error("No components found");
    }
    const components = [];
    return new Promise(async (resolve) => {
        for (const file of files) {
            if(file.isDirectory()){
                const componentFolder = `${file.parentPath}/${file.name}`;
                const filesFromFolder = await g__node_asyncFs.readdir(componentFolder, { withFileTypes: true });
                for (const f of filesFromFolder) {
                    const { name, ...props } = f;
                    if(name.endsWith(".tsx") || name.endsWith(".ts") || name.endsWith(".jsx") || name.endsWith(".js") || name.endsWith(".css")){
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

function Mount__Components(components){
    const componentsMounted = []
    return new Promise(resolve => {
        for(const component of components){
            const result = sucrase.transform(component.code, {transforms: ["jsx", "typescript", "imports"]})
            const reactComponent = React.createElement(result.code);
            if(!!reactComponent)
            componentsMounted.push(reactComponent);
        }
        return resolve(componentsMounted);
    });
}

module.exports = {
    Prepare__Components
}