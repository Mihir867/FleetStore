import server from "./app.js";
import { connectDB } from "./config/db.js";

const serverStar = server.listen(3000, async (err) => {
  if (err) {
    console.log(`server failed with error ${err}`);
  } else {
    await connectDB();
    console.log(`server is running at http://localhost:3000`);
  }
});
