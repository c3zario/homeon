import express from "express";
import path from "path";
import { connectToDatabase, List, collections } from './Database';

const app = express();
app.use(express.static("frontend/public"));

Main();
async function Main() 
{
    await connectToDatabase();
    //console.log(List)

    app.get("*", (req, res) => {
        res.sendFile(path.resolve("frontend/public/index.html"));
    });
    app.post("/test", async (req, res) => {
        res.send(List);
    });

    app.listen(process.env.PORT || 3000);
}

