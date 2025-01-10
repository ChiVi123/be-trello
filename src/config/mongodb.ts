import { Db, MongoClient, ServerApiVersion } from "mongodb";

const MONGO_PASSWORD = "PQIxWsMkc7vMAxm2";
const MONGO_URI = `mongodb+srv://vinghcit1811:${MONGO_PASSWORD}@cluster0.mrncr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const MONGO_DATABASE_NAME = "trello-db";

const mongoClientInstance = new MongoClient(MONGO_URI, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

let mongoDatabaseInstance: Db | null = null;

export const connectDB = async () => {
    await mongoClientInstance.connect();
    mongoDatabaseInstance = mongoClientInstance.db(MONGO_DATABASE_NAME);
};
export const getDB = () => {
    if (!mongoDatabaseInstance) throw new Error("Must connect to Database first");
    return mongoDatabaseInstance;
};
export const closeMongoDB = async () => {
    await mongoClientInstance.close();
};
