const g__node_process = require("node:process");
const g__node_asyncFs = require("node:fs/promises");
const g__nodePath = require("node:path");
const g__node_fs = require("node:fs");
const g__rootFile = g__node_process.cwd();

const g__envs = Object.create({});

module.exports = {
    g__envs,
    g__rootFile,
    g__node_process,
    g__nodePath,
    g__node_fs,
    g__node_asyncFs

};