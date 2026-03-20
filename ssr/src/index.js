let node_http = require("node:http");
let node_childProcess = require("node:child_process");
let node_path = require("node:path");
let node_fs = require("node:fs/promises");

const { Environment, Component} = require('./func');

const MIME = {
    '.css': 'text/css',
    '.js':  'text/javascript',
};

const TEMPLATES_DIR = node_path.join(__dirname, 'templates');

(async function Start() {
    await Environment.Prepare();
    const components = await Component.Get();

    const server = node_http.createServer(async (request, response) => {
        const ext = node_path.extname(request.url);

        if (MIME[ext]) {
            try {
                const file = await node_fs.readFile(node_path.join(TEMPLATES_DIR, request.url), { encoding: 'utf-8' });
                response.setHeader('Content-Type', MIME[ext]);
                response.end(file);
            } catch {
                response.writeHead(404);
                response.end();
            }
            return;
        }

        response.setHeader('Content-Type', 'text/html');
        const html = await Component.toHTML({script: components});
        response.end(html);
    });

    await server.listen(4998);
    node_childProcess.exec("open http://localhost:4998");
})();