import "dotenv/config";

const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoClusterName = process.env.MONGO_CLUSTER_NAME;

const mongoUri = `mongodb+srv://${mongoUsername}:${mongoPassword}@${mongoClusterName}.mongodb.net/`;

const corsOriginsString = process.env.CORS_WHITELIST_ORIGINS;

if (!process.env.WEBSITE_DOMAIN) {
    throw new Error("env variable WEBSITE_DOMAIN is required");
}
if (!process.env.ACCESS_TOKEN_SECRET_SIGNATURE) {
    throw new Error("env variable ACCESS_TOKEN_SECRET_SIGNATURE is required");
}
if (!process.env.ACCESS_TOKEN_LIFE) {
    throw new Error("env variable ACCESS_TOKEN_LIFE is required");
}
if (!process.env.REFRESH_TOKEN_SECRET_SIGNATURE) {
    throw new Error("env variable REFRESH_TOKEN_SECRET_SIGNATURE is required");
}
if (!process.env.REFRESH_TOKEN_LIFE) {
    throw new Error("env variable REFRESH_TOKEN_LIFE is required");
}

export const env = {
    AUTHOR: process.env.AUTHOR,
    BUILD_MODE: process.env.BUILD_MODE,

    MONGO_URI: process.env.MONGO_URI || mongoUri + "?retryWrites=true&w=majority&appName=Cluster0",
    MONGO_DATABASE_NAME: process.env.MONGO_DATABASE_NAME,

    LOCAL_SERVER_HOSTNAME: process.env.LOCAL_SERVER_HOSTNAME || "localhost",
    LOCAL_SERVER_PORT: process.env.LOCAL_SERVER_PORT ? Number(process.env.LOCAL_SERVER_PORT) : 8080,
    CORS_WHITELIST_ORIGINS: corsOriginsString?.split(",") || [],

    WEBSITE_DOMAIN: process.env.WEBSITE_DOMAIN,

    BREVO_API_KEY: process.env.BREVO_API_KEY,
    BREVO_EMAIL_ADDRESS: process.env.BREVO_EMAIL_ADDRESS,
    BREVO_EMAIL_NAME: process.env.BREVO_EMAIL_NAME,

    ACCESS_TOKEN_SECRET_SIGNATURE: process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
    ACCESS_TOKEN_LIFE: process.env.ACCESS_TOKEN_LIFE,

    REFRESH_TOKEN_SECRET_SIGNATURE: process.env.REFRESH_TOKEN_SECRET_SIGNATURE,
    REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_LIFE,

    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
