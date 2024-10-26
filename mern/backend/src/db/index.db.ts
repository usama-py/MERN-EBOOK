import mongoose from "mongoose";

const uri = "mongodb://mongodb:27017/ebook-store";

if (!uri) throw new Error("Database uri is missing!");

export const dbConnect = () => {
  mongoose
    .connect(uri)
    .then(() => {
      console.log("db connected!");
    })
    .catch((error) => {
      console.log("db connection failed: ", error.message);
    });
};


dbConnect();
