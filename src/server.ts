import app from "./app";
import mongoose from "mongoose";

const port = (process.env.PORT as string) || 3000;
const mongo_uri = process.env.MONGO_URI as string;

mongoose
  .connect(mongo_uri)
  .then(() => {
    console.log("Successfully connected to Database");
    app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`);
    });
  })
  .catch(() => {
    console.log("Error connecting to MongoDB");
  });
