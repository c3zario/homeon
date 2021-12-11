import express from "express";

const app = express();
app.use(express.static("frontend/public"));
app.listen(process.env.PORT || 3000);
