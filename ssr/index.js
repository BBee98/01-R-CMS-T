let node_http = require("node:http");
let node_childProcess = require("node:child_process");

const { Environment, Component} = require('./funcs');

(async function Start() {
    await Environment.Prepare();
    const components = await Component.Get();

    const server = node_http.createServer(async (request, response) => {
        response.setHeader('Content-Type', 'text/html');
        const html = await Component.toHTML({script: components});
            response.end(html);
    });

    await server.listen(4998);
    node_childProcess.exec("open http://localhost:4998");
})();