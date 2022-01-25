import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

const process = {
    env: {
        DB_CONN_STRING: "mongodb://localhost:27017",
        DB_NAME: "HomeON",
    },
};

export async function getDatabase() {
    dotenv.config();
    const client = new MongoClient(process.env.DB_CONN_STRING);
    await client.connect();
    const database = client.db(process.env.DB_NAME);
    return {
        users: database.collection<User>("users"),
        groups: database.collection<Group>("groups"),
    };
}

type ListElement = {
    text: string;
    count: number;
};

type User = {
    login: string;
    password: string;
    email: string;
    confirmEmailToken?: string;
    groups: string[];
};

type Group = {
    name: string;
    token: string;
    plans: Plan[];
    list: ListElement[];
};

type Plan = {
    start: string;
    end: string;
    text: string;
};