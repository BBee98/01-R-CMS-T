const {ENVIRONMENTS, OPTIONAL_ENVIRONMENTS} = require("../../core/constants");

const {g__envs, g__node_process, g__node_asyncFs, g__rootFile   } = require("./constants")

async function Prepare() {
    const envFile = getVariables();
    await readVariables(envFile);
}

function getVariables() {
    let envs = g__node_process.argv;
    let envFile = envs.find(arg => arg.startsWith("--env-file="));
    if (!envFile) {
        throw new Error("Missing --env-file argument. Please provide --env-file with the name of environment file project")
    }
    let envFileName = envFile.split("=")[1];
    if (!envFileName) {
        throw new Error("Missing --env-file value. Please provide --env-file with the name of environment file project")
    }
    if (!envFileName.startsWith(".")) envFileName = `.${envFileName}`;
    return `${g__rootFile}/${envFileName}`;
}

async function readVariables(envFile) {
    let content = await g__node_asyncFs.readFile(envFile, "utf-8");
    const envsFromContent = content.replace(/[\r\n]+/g, ' ').split(" ");
    envsFromContent.forEach(env => {
        const [key, value] = env.trim().split("=");
        if(key.length === 0) return;
        const envVarKeyExists = ENVIRONMENTS.includes(key);
        const optionalEnvVarKeyExists = OPTIONAL_ENVIRONMENTS.includes(key);
        const envVarValueExists = (!!value && value.length > 0);
        if (optionalEnvVarKeyExists && envVarValueExists) {
            Object.assign(g__envs, {[key]: value.replace(/"/g, '')});
            return;
        }
        if (envVarKeyExists && envVarValueExists) {
            Object.assign(g__envs, {[key]: value.replace(/"/g, '')});
        } else {
            if (!envVarKeyExists) {
                throw new Error(`Missing environment variable ${key}`);
            }
            if (!envVarValueExists) {
                throw new Error(`Missing value for environment variable ${key}`);
            }
        }
    })
    Object.assign(g__envs, {
        URL_COMPONENTS_FOLDER: `${g__rootFile}/src/${g__envs.REPOSITORY_COMPONENTS_FOLDER}`,
    })
}

module.exports = {
    Prepare
};