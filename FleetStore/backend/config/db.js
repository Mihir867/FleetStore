import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("db connecting...");
    const res = await mongoose.connect("mongodb://127.0.0.1:27017/FleetStore", {
      useNewUrlParser: true,
      useUnifiedTopology: true
  });
    console.log(`mongodb connected with server ${res.connection.host}`);
  } catch (error) {
    console.log("mongodb connection failed!");
    console.log(error);
  }
};
