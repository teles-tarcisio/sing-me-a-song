import { prisma } from "../../src/database.js";
import { CreateRecommendationData } from "../../src/services/recommendationsService.js";

async function registerRecommendation(recommendation: CreateRecommendationData) {
  const addedRecommendation = await prisma.recommendation.create({
    data: {
      name: recommendation.name,
      youtubeLink: recommendation.youtubeLink,
    },
  });
  return addedRecommendation;  
}

const scenariosFactory = {
  registerRecommendation,
};

export default scenariosFactory;