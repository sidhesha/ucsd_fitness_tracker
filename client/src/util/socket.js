import { io } from "socket.io-client";
import { API_SERVER } from "../config";

const socket = io(API_SERVER, { 
    withCredentials: true,
    autoConnect: false 
});

export default socket;
