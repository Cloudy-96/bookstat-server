import "dotenv/config";
import express from "express";
import cors from "cors";
import bookRouter from "./routes/book.js";
import userRouter from "./routes/user.js";

import authRouter from "./routes/auth.js";

const app = express();

app.disable("x-powered-by");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/books", bookRouter);
app.use("/users", userRouter);

app.use("/", authRouter);

app.get("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    data: {
      resource: "Not found",
    },
  });
});

export default app;
