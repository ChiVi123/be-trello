/* eslint-disable no-console */
import exitHook from "async-exit-hook";
import cors from "cors";
import express from "express";
import { corsOptions } from "~config/cors";
import { env } from "~config/environment";
import { closeMongoDB, connectDB } from "~config/mongodb";
import { errorHandlingMiddleware } from "~middlewares/error-handling-middleware";
import { apisV1 } from "~routes/v1";

const startServer = () => {
    const app = express();

    // Middlewares
    app.use(cors(corsOptions));
    app.use(express.json());

    // API
    app.use("/v1", apisV1);

    // Error handling - place right before listen method - if else the middleware is not working
    app.use(errorHandlingMiddleware);

    if (env.BUILD_MODE === "development") {
        app.listen(env.LOCAL_SERVER_PORT, env.LOCAL_SERVER_HOSTNAME, () => {
            console.log(
                "3. [Development] Hi",
                `${env.AUTHOR},`,
                "Server running at",
                `http://${env.LOCAL_SERVER_HOSTNAME}:${env.LOCAL_SERVER_PORT}`,
            );
        });
    } else {
        app.listen(process.env.PORT, () => {
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
