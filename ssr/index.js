let node_childProcess = require("node:child_process");
let node_http = require("node:http");
let node_path = require("node:path");
let node_process = require("node:process");
let node_asyncFs = require("node:fs/promises");

const sucrase = require("sucrase");

const {readComponents: c, readEnvs: e, renderComponents: r} = require('./funcs');

(async function Start() {
    await e.Prepare__Environment();
    const mountedClientComponents = await c.Prepare__Components();
    const file = (fileName) => node_path.join(node_process.cwd(), `ssr/client/dist/components/${fileName}`);

/*
    const server = node_http.createServer(async (request, response) => {
        response.setHeader('Content-Type', 'text/html');
        response.end()
    });

    await server.listen(4998, () => {

    });
    node_childProcess.exec("open http://localhost:4998");
*/

})();