import { jest } from "@jest/globals";
import { CreateRecommendationData, recommendationService } from "../../src/services/recommendationsService.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { Recommendation } from "@prisma/client";

jest.mock("../../src/repositories/recommendationRepository.js");

describe("recommendations unit test suite", () => {
  it("creates a recommendation given valid data", async () => {
    jest.spyOn(recommendationRepository, "findByName").mockResolvedValueOnce(null);
    jest.spyOn(recommendationRepository, "create").mockImplementationOnce(():any => {});

    const newRecommendation: CreateRecommendationData = {
      name: "new_recommendation",
      youtubeLink: "https://www.youtube.com/new_recommendation",
    };

    await recommendationService.insert(newRecommendation);
    expect(recommendationRepository.findByName).toBeCalledWith(newRecommendation.name);
    expect(recommendationRepository.create).toBeCalledWith(newRecommendation);
  });

  it("throws an error when trying to add recommendation with duplicated name", async () => {
    const existentRecommendation: Recommendation = {
      id: 12,
      name: "existent name",
      youtubeLink: "https://www.youtube.com/existent_recommendation",
      score: 12,
    };

    jest.spyOn(recommendationRepository, "findByName").mockResolvedValueOnce(existentRecommendation);

    const duplicatedRecommendation: CreateRecommendationData = {
      name: existentRecommendation.name,
      youtubeLink: existentRecommendation.youtubeLink,
    };

    const result = recommendationService.insert(duplicatedRecommendation);

    expect(recommendationRepository.findByName)
      .toBeCalledWith(duplicatedRecommendation.name);
    expect(result)
      .rejects
      .toEqual({ type: "conflict", message: "Recommendations names must be unique"});

  });

});