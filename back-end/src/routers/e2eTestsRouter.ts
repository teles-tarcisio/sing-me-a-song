import { Router } from "express";
import { e2eTestsController } from "../controllers/e2eTestsController.js";
import { recommendationController } from "../controllers/recommendationController.js";

const e2eRouter = Router();
e2eRouter.post("/tests/reset-database", e2eTestsController.deleteRecommendations);
e2eRouter.post("/tests/populate-top", recommendationController.insert);

export default e2eRouter;