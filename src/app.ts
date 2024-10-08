import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import cookieParser from "cookie-parser";

const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://co-meet-client.vercel.app"],
    credentials: true,
  })
);

// application routes
app.use("/api/", router);

app.get("/", (req, res) => {
  res.send("CoMeet server running!!");
});

// middleware to handle invalid routes (404 Not Found route)
app.use(notFound);

// Global Error Handler middlewares
app.use(globalErrorHandler);

export default app;
