const g__node_process = require("node:process");
const g__node_childProcess = require("node:child_process");
const g__node_asyncFs = require("node:fs/promises");
const { ENVIRONMENTS, EXTENSION_CSS_FILES, EXTENSION_JS_FILES} = require("./constants");

/**
 * GLOBAL VARIABLES
 */

const g__envs = Object.create({});
const g__rootFile = g__node_process.cwd();


(async function(){
    let envFile = Get__envFile();
    await Read__envFile(envFile);
    const fileComponents = await Read__Components();
    if(!fileComponents){
        throw new Error("Missing components folder. Please provide a components folder with your components")
    }
    Render__Components(fileComponents);
    g__node_childProcess.execSync("react-scripts start");

})()


function Get__envFile(){
    let envs = g__node_process.argv;
    let envFile = envs.find(arg => arg.startsWith("--env-file="));
    if(!envFile){
        throw new Error("Missing --env-file argument. Please provide --env-file with the name of environment file project")
    }
    let envFileName = envFile.split("=")[1];
    if (!envFileName) {
        throw new Error("Missing --env-file value. Please provide --env-file with the name of environment file project")
    }
    if (!envFileName.startsWith(".")) envFileName = `.${envFileName}`;
    return `${g__rootFile}/${envFileName}`;
}

async function Read__envFile(envFile){
    let content = await g__node_asyncFs.readFile(envFile, "utf-8");
    const envsFromContent = content.replace(/[\r\n]+/g, ' ').split(" ");
    envsFromContent.forEach(env => {
        const [key, value] = env.trim().split("=");
        const envVarKeyExists = ENVIRONMENTS.includes(key);
        const envVarValueExists = (!!value && value.length > 0);
        if(envVarKeyExists && envVarValueExists){
            Object.assign(g__envs, {[key]: value.replace(/"/g, '')});
        } else {
            if(!envVarKeyExists){
                console.error(`Missing environment variable ${key}`);
            }
            if(!envVarValueExists){
                console.error(`Missing value for environment variable ${key}`);
            }
        }
    })
}

async function Read__Components(){
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
                    const fileName = f.name;
                    if(fileName.endsWith(".tsx") || fileName.endsWith(".ts") || fileName.endsWith(".jsx") || fileName.endsWith(".js") || fileName.endsWith(".css")){
                        components.push(f);
                    }
                }
            }
        }
        return resolve(components)
    });
}

async function Render__Components(fileComponents){
    for (const file of fileComponents) {
        const fileDirectory = `${file.parentPath}/${file.name}`;
        const code = await g__node_asyncFs.readFile(fileDirectory, { encoding: "utf-8"});
    }
}
