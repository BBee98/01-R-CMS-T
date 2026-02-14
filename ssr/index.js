import node_childProcess from "node:child_process";
import node_net from "node:net";

let server = null;
let client = null;

(async function Start() {
    server = node_net.createServer(({req, res}) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
    });
    server.listen(4500);
    client = node_net.createConnection(4500);
    node_childProcess.exec("open http://localhost:3000")

})();