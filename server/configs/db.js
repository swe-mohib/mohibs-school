import mongoose from "mongoose";

export const connectToDb = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to Db:", conn.connection.host);
};
