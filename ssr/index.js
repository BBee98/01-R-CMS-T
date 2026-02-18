let node_childProcess = require("node:child_process");
let node_net = require("node:net");

let server = null;
let client = null;

(async function Start() {
    server = node_net.createServer();
    server.listen(4998);
    client = node_net.createConnection(4998);
    node_childProcess.exec("open http://localhost:4998")

})();