import { Db, MongoClient, ServerApiVersion } from "mongodb";
import { env } from "~config/environment";

const mongoClientInstance = new MongoClient(env.MONGO_URI, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

let mongoDatabaseInstance: Db | null = null;

export const connectDB = async () => {
    await mongoClientInstance.connect();
    mongoDatabaseInstance = mongoClientInstance.db(env.MONGO_DATABASE_NAME);
};
export const getDB = () => {
    if (!mongoDatabaseInstance) throw new Error("Must connect to Database first");
    return mongoDatabaseInstance;
};
export const closeMongoDB = async () => {
    await mongoClientInstance.close();
};
