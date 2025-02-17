/* eslint-disable no-console */
import exitHook from "async-exit-hook";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import http from "http";
import socketIO from "socket.io";
import { corsOptions } from "~config/cors";
import { env } from "~config/environment";
import { closeMongoDB, connectDB } from "~config/mongodb";
import { errorHandlingMiddleware } from "~middlewares/error-handling-middleware";
import { apisV1 } from "~routes/v1";
import { inviteUserToBoardSocket } from "~sockets/invite-user-to-board-socket";

const startServer = () => {
    const app = express();

    // https://stackoverflow.com/questions/22632593/how-to-disable-webpage-caching-in-expressjs-nodejs/53240717#53240717
    app.use((req, res, next) => {
        res.set("Cache-Control", "no-store");
        next();
    });

    // Middlewares
    app.use(cookieParser());
    app.use(cors(corsOptions));
    app.use(express.json());

    // API
    app.use("/v1", apisV1);

    // Error handling - place right before listen method - if else the middleware is not working
    app.use(errorHandlingMiddleware);

    // https://socket.io/get-started/chat/#integrating-socketio
    // Create new server wrap app (express) to handle real-time with socket
    const server = http.createServer(app);
    const io = new socketIO.Server(server, { cors: corsOptions });

    io.on("connection", (socket) => {
        // Add all features socket is here
        inviteUserToBoardSocket(socket);
    });

    if (env.BUILD_MODE === "development") {
        server.listen(env.LOCAL_SERVER_PORT, env.LOCAL_SERVER_HOSTNAME, () => {
            console.log(
                "3. [Development] Hi",
                `${env.AUTHOR},`,
                "Server running at",
                `http://${env.LOCAL_SERVER_HOSTNAME}:${env.LOCAL_SERVER_PORT}`,
            );
        });
    } else {
        server.listen(process.env.PORT, () => {
            console.log(`3. [Production] Hi ${env.AUTHOR}, Server running at port:${process.env.PORT}`);
        });
    }

    exitHook(() => {
        console.log("n. Exit App");
        closeMongoDB();
    });
};

console.log("1. Start connect MongoDB...");

connectDB()
    .then(() => console.log("2. MongoDB connected"))
    .then(() => startServer())
    .catch((error) => {
        console.error("[MongoDB connect error]", error);
        process.exit(0);
    });
