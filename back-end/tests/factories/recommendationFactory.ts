import { faker } from "@faker-js/faker";
import { CreateRecommendationData } from "../../src/services/recommendationsService";

function createFakeRecommendation(): CreateRecommendationData {
  return {
    name: faker.random.words(4),
    youtubeLink: `https://www.youtube.com/${faker.random.alpha(10)}`,
  };
}

const recommendationFactory = {
  createFakeRecommendation,
};

export default recommendationFactory;