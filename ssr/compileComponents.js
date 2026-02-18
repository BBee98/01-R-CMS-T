let node_fs = require("node:fs");
let node_process = require("node:process");
let node_asyncFs = require("node:fs/promises");
let { ENVIRONMENTS} = require("./constants");
let rootFile = node_process.cwd();

/**
 * GLOBAL VARIABLES
 */

let envKeys = Object.create({});

(async function(){
    let envFile = Get__envFile();
     await Read__envFile(envFile);
     console.log("envKeys", envKeys)
})()


function Get__envFile(){
    let envs = node_process.argv;
    let envFile = envs.find(arg => arg.startsWith("--env-file="));
    if(!envFile){
        throw new Error("Missing --env-file argument. Please provide --env-file with the name of environment file project")
    }
    let envFileName = envFile.split("=")[1];
    if (!envFileName) {
        throw new Error("Missing --env-file value. Please provide --env-file with the name of environment file project")
    }
    if (!envFileName.startsWith(".")) envFileName = `.${envFileName}`;
    return `${rootFile}/${envFileName}`;
}

async function Read__envFile(envFile){
    let content = await node_asyncFs.readFile(envFile, "utf-8");
    const envsFromContent = content.replace(/[\r\n]+/g, ' ').split(" ");
    envsFromContent.forEach(env => {
        const [key, value] = env.trim().split("=");
        const envVarKeyExists = ENVIRONMENTS.includes(key);
        const envVarValueExists = (!!value && value.length > 0);
        if(envVarKeyExists && envVarValueExists){
            Object.assign(envKeys, {[key]: value.replace(/"/g, '')});
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

