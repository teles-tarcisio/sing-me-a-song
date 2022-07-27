import { recommendationRepository } from "../repositories/recommendationRepository.js";


async function deleteAllRecommendations() {
  return await recommendationRepository.deleteAll();

}

export const e2eServices = {
  deleteAllRecommendations,
};