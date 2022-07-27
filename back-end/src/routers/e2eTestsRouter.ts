import { Router } from "express";
import { e2eTestsController } from "../controllers/e2eTestsController.js";

const e2eRouter = Router();
e2eRouter.post("/tests/reset-database", e2eTestsController.deleteRecommendations);

export default e2eRouter;