import { Router } from "express";
import recommendationRouter from "./recommendationRouter.js";
import e2eRouter from "./e2eTestsRouter.js";

const mainRouter = Router();

mainRouter.use("/recommendations", recommendationRouter);
if (process.env.NODE_ENV === "test") {
  mainRouter.use(e2eRouter);
}

export default mainRouter;