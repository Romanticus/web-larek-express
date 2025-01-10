import path from "path";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors()); 
mongoose.connect("mongodb://127.0.0.1:27017/weblarek");

app.listen(3000, () => {
  console.log(`Сервер запущен на порту 3000`);
});
