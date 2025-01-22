import { Socket } from "socket.io";

export const inviteUserToBoardSocket = (socket: Socket) => {
    socket.on("FE_USER_WERE_INVITED_TO_BOARD", async (invitation) => {
        // client01 send request to server socket
        // server send all other clients, exclude client01 that send request to server
        socket.broadcast.emit("BE_USER_WERE_INVITED_TO_BOARD", invitation);
    });
};
