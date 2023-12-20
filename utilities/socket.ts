import { io } from "socket.io-client";
// "https://bgjxgrgm-3000.uks1.devtunnels.ms/"
const socket = (token: string) => {
  return io(`${process.env.NEXT_PUBLIC_RENDER}`, {
    auth: {
      token,
    },
    reconnection: true,
    reconnectionDelay: 600000,
    reconnectionAttempts: 5,
  });
};
export default socket;
