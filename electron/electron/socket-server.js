const WebSocketServer = require("websocket").server;
const http = require("http");
const ip = require("ip");
const kill = require("kill-port");

const connections = [];
let httpServer;

const stopServer = async () => {
  return new Promise((resolve, reject) => {
    kill("8080", "tcp")
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

const startServer = async (port, onConnect) => {
  await stopServer();

  httpServer = http.createServer((request, response) => {
    console.log(`received request for ${request}`);

    response.writeHead(404);
    response.end();
  });

  try {
    httpServer.listen(port, () => {
      onConnect(ip.address());
    });
  } catch (error) {
    console.log("already listening (testing only)");
  }

  const wsServer = new WebSocketServer({ httpServer });

  wsServer.on("request", request => {
    const connection = request.accept("echo-protocol", request.origin);
    connections.push(connection);

    console.log(`peer ${request.origin} connected`);

    connection.on("message", message => {
      if (message.type === "utf8") {
        connections.forEach(conn => conn.sendUTF(message.utf8Data));
      }
    });

    connection.on("close", () => {
      console.log(`peer ${connection.remoteAddress} disconnected`);
    });
  });
};

module.exports = { startServer };
