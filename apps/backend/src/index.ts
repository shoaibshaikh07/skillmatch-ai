import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import routes from "./routes";

const app = express();
const port = process.env.PORT || 3002;

app.use(
  cors({
    origin: process.env.BETTER_AUTH_URL, // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("what's up buddy?");
});

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
