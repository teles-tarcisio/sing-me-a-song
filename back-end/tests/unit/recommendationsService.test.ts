import { jest } from "@jest/globals";
import { CreateRecommendationData, recommendationService } from "../../src/services/recommendationsService.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";

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

});