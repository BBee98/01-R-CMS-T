import node_childProcess from "node:child_process";
import node_net from "node:net";

let server = null;
let client = null;

(async function Start() {
    server = node_net.createServer();
    server.listen(4998);
    client = node_net.createConnection(4998);
    node_childProcess.exec("open http://localhost:4998")

})();