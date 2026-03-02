let node_childProcess = require("node:child_process");
let node_http = require("node:http");

const {readComponents: c, readEnvs: e} = require('./funcs');

(async function Start() {
    await e.Prepare__Environment();
    const clientComponents = await c.Prepare__Components();
    const server = node_http.createServer((request, response) => {
        response.end(`
        <!DOCTYPE html>
<html lang="en">
 <body>
 
</body>
</html>`)
    });
    await server.listen(4998, () => {

    });
    node_childProcess.exec("open http://localhost:4998");

})();