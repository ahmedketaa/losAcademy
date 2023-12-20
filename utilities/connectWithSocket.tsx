import { Socket } from "socket.io-client";
import socket from "./socket";

let socketConnection: Socket | null = null;

export const getSocket = (token: string) => {
  if (!socketConnection) {
    socketConnection = socket(token);
  }

  return socketConnection;
};
