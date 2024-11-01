import { io } from "socket.io-client";

const Socket = io(import.meta.env.VITE_URL);


export default Socket;