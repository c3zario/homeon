import express from "express";
import path from "path";

const app = express();
app.use(express.static("frontend/public"));

app.get("*", (req, res) => {
    res.sendFile(path.resolve("frontend/public/index.html"));
});

app.listen(process.env.PORT || 3000);
