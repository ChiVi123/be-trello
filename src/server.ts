/* eslint-disable no-console */

import exitHook from "async-exit-hook";
import express from "express";
import { env } from "~config/environment";
import { closeMongoDB, connectDB } from "~config/mongodb";
import { apisV1 } from "~routes/v1";

const startServer = () => {
    const app = express();

    app.use(express.json());

    app.use("/v1", apisV1);

    app.listen(env.SERVER_PORT, env.SERVER_HOSTNAME, () => {
        console.log(`3. Hi ${env.AUTHOR}, Server running at http://${env.SERVER_HOSTNAME}:${env.SERVER_PORT}`);
    });

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
