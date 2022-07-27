import { Request, Response } from "express";
import { e2eServices } from "../services/e2eServices.js";


async function deleteRecommendations(req: Request, res: Response) {
  
  await e2eServices.deleteAllRecommendations();

  res.sendStatus(201);
}


export const e2eTestsController = {
  deleteRecommendations,  
};