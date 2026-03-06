let node_childProcess = require("node:child_process");
let node_http = require("node:http");

const {readComponents: c, readEnvs: e, writeComponents: w} = require('./funcs');

(async function Start() {
    await e.Prepare__Environment();
    const clientComponents = await c.Prepare__Components();
    let html = ""
    for(const c of clientComponents){
        html = await w.Generate__ComponentHTML({
            componentName: c.name,
            componentScript: c.source
        })
    }
    const server = node_http.createServer((request, response) => {
        response.end(html)
    });

    await server.listen(4998, () => {

    });
    node_childProcess.exec("open http://localhost:4998");

})();