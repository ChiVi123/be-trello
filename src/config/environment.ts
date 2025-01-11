import "dotenv/config";

const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoClusterName = process.env.MONGO_CLUSTER_NAME;

const mongoUri = `mongodb+srv://${mongoUsername}:${mongoPassword}@${mongoClusterName}.mongodb.net/`;

const corsOriginsString = process.env.CORS_WHITELIST_ORIGINS;

export const env = {
    AUTHOR: process.env.AUTHOR,
    BUILD_MODE: process.env.BUILD_MODE,
    MONGO_URI: process.env.MONGO_URI || mongoUri + "?retryWrites=true&w=majority&appName=Cluster0",
    MONGO_DATABASE_NAME: process.env.MONGO_DATABASE_NAME,
    SERVER_PROTOCOL: process.env.SERVER_PROTOCOL,
    SERVER_HOSTNAME: process.env.SERVER_HOSTNAME || "http",
    SERVER_PORT: process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 8080,
    CORS_WHITELIST_ORIGINS: corsOriginsString?.split(",") || [],
};
