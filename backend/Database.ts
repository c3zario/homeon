import { MongoClient } from "mongodb";

let env = {
    DB_CONN: "mongodb://localhost:27017/",
    DB_NAME: "HomeON"
}

const conn = MongoClient.connect(env.DB_CONN)

export async function Insert(collect: string, obj: any) {
    const collection = (await conn).db(env.DB_NAME).collection(collect)
    await collection.insertOne(obj)
}

export async function Find(collect: string, obj: any) {
    const collection = (await conn).db(env.DB_NAME).collection(collect)
    return await collection.find(obj).toArray()
}
