import express from "express";
import path from "path";
import { connectToDatabase, List, collections } from './Database';
import bodyParser from "body-parser";

const app = express();
app.use(express.static("frontend/public"));
app.use(bodyParser.text());

Main();
async function Main() 
{
    await connectToDatabase();

    app.get("*", (req, res) => {
        res.sendFile(path.resolve("frontend/public/index.html"));
    });
    app.post("/test", (req, res) => {
        res.send(List);
    });
    app.post("/updateList", (req, res) => {
        collections.list?.drop();
        collections.list?.insertMany(JSON.parse(req.body));
    })
    app.post("/addToList", async (req, res) => {
        //console.log(req.body);
        let last:any = await collections.list?.find({}).sort({_id:-1}).limit(1).toArray();
        last = last[0].id;
        let d = JSON.parse(req.body);
        let obj = {id: last + 1, text: d.text, count: d.count};
        collections.list?.insertOne(obj);
    });
    app.listen(process.env.PORT || 3000);
}

