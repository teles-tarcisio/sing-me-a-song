import cors from "cors";
import express from "express";
import "express-async-errors";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware.js";
import mainRouter from "./routers/index.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(mainRouter);
app.use(errorHandlerMiddleware);

export default app;
