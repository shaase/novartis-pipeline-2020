import { w3cwebsocket, IMessageEvent } from "websocket";
import { guid } from "radius-utils";

export interface SocketEvent {
  type: string;
  message: string;
}

let client: w3cwebsocket;
const subscribers: { (e: SocketEvent): void }[] = [];

export const startClient = (ip: string): void => {
  const address = `ws://${ip}`;
  client = new w3cwebsocket(address, "echo-protocol"); // eslint-disable-line

  client.onerror = (error: Error) => {
    console.log(`ws client error: ${JSON.stringify(error)}`);
  };

  client.onopen = () => {
    console.log(`ws client is listening at:  http://${ip}`);
  };

  client.onclose = () => {
    console.log("ws client closed");
    setTimeout(() => {
      startClient(ip);
    }, 20 * 1000);
  };

  client.onmessage = (e: IMessageEvent) => {
    if (typeof e.data === "string") {
      const json = JSON.parse(e.data);
      subscribers.forEach((callback: { (e: SocketEvent): void }) => {
        callback(json);
      });
    }
  };
};

export const subscribe = (callback: (e: SocketEvent) => void): void => {
  subscribers.push(callback);
};

export const post = (type: string, message: string): void => {
  try {
    if (client !== undefined) {
      const id = guid();
      const event = { id, type, message };

      const str = JSON.stringify(event);
      client.send(str);
    }
  } catch (error) {
    console.log("sockets not connected");
  }
};
