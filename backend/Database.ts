import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

let process = {
    env: {DB_CONN_STRING: "mongodb://localhost:27017",
    DB_NAME: "HomeOn",
    COLLECTION_NAME: "List"}
}
export const collections: { list?: mongoDB.Collection } = {}
export let List = {};
export async function connectToDatabase() {
    dotenv.config();
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
    await client.connect();
    const db: mongoDB.Db = client.db(process.env.DB_NAME);
    const Collection: mongoDB.Collection = db.collection(process.env.COLLECTION_NAME);
    collections.list = Collection;
    List = await collections?.list?.find({}).toArray();
}
export async function GetList()
{
    return await collections?.list?.find({}).toArray();
}

