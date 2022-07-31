import { Recommendation } from "@prisma/client";
import { prisma } from "../../src/database.js";
import { CreateRecommendationData } from "../../src/services/recommendationsService.js";

async function registerOneRecommendation(recommendation: CreateRecommendationData) {
  const addedRecommendation = await prisma.recommendation.create({
    data: {
      name: recommendation.name,
      youtubeLink: recommendation.youtubeLink,
    },
  });
  return addedRecommendation;  
}

function __generateRecommendationsArray(size: number): CreateRecommendationData[] {
  const recommendationsArray: CreateRecommendationData[] = [];
  for (let i = 0; i < size; i++) {
    recommendationsArray.push({
      name: `${i}`,
      youtubeLink: `https://www.youtube.com/link${i}`,
    });
  }

  return recommendationsArray;
}

async function addRecommendationsScenario(size: number) {
  const recommendationsArray = __generateRecommendationsArray(size);

  await prisma.recommendation.createMany({
    data: recommendationsArray,
    skipDuplicates: true,
  });
}

async function addScoredRecommendationsScenario(size: number) {
  const recommendationsArray = __generateRecommendationsArray(size);
  recommendationsArray

  recommendationsArray.forEach(async (video, index) => {
    await prisma.recommendation.upsert({
      where: { name: video.name },
      update: {},
      create: {
        name: video.name,
        youtubeLink: video.youtubeLink,
        score: index + 50,
      },
    });  
  });

}

const scenariosFactory = {
  registerOneRecommendation,
  addRecommendationsScenario,
  addScoredRecommendationsScenario,
};

export default scenariosFactory;