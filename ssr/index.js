let node_http = require("node:http");
let node_childProcess = require("node:child_process");

const {readComponents: c, readEnvs: e, renderComponents: r} = require('./funcs');

(async function Start() {
    await e.Prepare__Environment();
    const components = await c.Prepare__Components();

    const server = node_http.createServer(async (request, response) => {
        response.setHeader('Content-Type', 'text/html');
        response.end(JSON.stringify(components));
    });

    await server.listen(4998);
    node_childProcess.exec("open http://localhost:4998");
})();