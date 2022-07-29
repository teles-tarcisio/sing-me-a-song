import { jest } from "@jest/globals";
import { CreateRecommendationData, recommendationService } from "../../src/services/recommendationsService.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { Recommendation } from "@prisma/client";

jest.mock("../../src/repositories/recommendationRepository.js");

afterEach(() => {
  jest.restoreAllMocks();
});

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

  it("should correctly upvote a recommendation", async () => {
    const foundRecommendation: Recommendation = {
      id: 7,
      name: "upvote_recommendation",
      youtubeLink: "upvote_recommendation",
      score: 7
    };

    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(foundRecommendation);
    jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce(():any => {});

    await recommendationService.upvote(foundRecommendation.id);
    expect(recommendationRepository.find).toBeCalledWith(foundRecommendation.id);
    expect(recommendationRepository.updateScore).toBeCalledWith(foundRecommendation.id, "increment");
  });

  it("should correctly downvote a recommendation", async () => {
    const foundRecommendation: Recommendation = {
      id: 14,
      name: "downvote_recommendation",
      youtubeLink: "downvote_recommendation",
      score: 14
    };

    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(foundRecommendation);
    jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce(foundRecommendation);

    await recommendationService.downvote(foundRecommendation.id);
    expect(recommendationRepository.find).toBeCalledWith(foundRecommendation.id);
    expect(recommendationRepository.updateScore).toBeCalledWith(foundRecommendation.id, "decrement");
  });

  it("throws error when trying to upvote inexistent recommendation", async () => {
    
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(undefined);

    const result = recommendationService.upvote(404);
    expect(recommendationRepository.find).toBeCalledWith(404);
    expect(result).rejects.toEqual({ type: "not_found", message: "" });
  });

  it("should downvote and remove a recommendation when score < -5", async () => {
    const foundRecommendation: Recommendation = {
      id: 5,
      name: "downvote_recommendation",
      youtubeLink: "downvote_recommendation",
      score: -6,
    };

    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(foundRecommendation);
    jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce(foundRecommendation);
    jest.spyOn(recommendationRepository, "remove").mockImplementationOnce((): any => {});

    await recommendationService.downvote(foundRecommendation.id);
    expect(recommendationRepository.find).toBeCalledWith(foundRecommendation.id);
    expect(recommendationRepository.updateScore).toBeCalledWith(foundRecommendation.id, "decrement");
    expect(recommendationRepository.remove).toBeCalledWith(foundRecommendation.id);
  });

  it("should correctly call get()", async () => {
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([]);

    await recommendationService.get();
    expect(recommendationRepository.findAll).toBeCalledTimes(1);
  });

  it("should correctly call getTop()", async () => {
    const amount: number = 9;    
    jest.spyOn(recommendationRepository, "getAmountByScore").mockResolvedValueOnce([]);

    await recommendationService.getTop(amount);
    expect(recommendationRepository.getAmountByScore).toBeCalledWith(amount);
  });

  it("should correctly call getRandom() for random = 0.5", async () => {
    const fixedRandomValue: number = 0.5;
    const recommendations: Recommendation[] = [
      {
        id: 1,
        name: "1",
        youtubeLink: "link1",
        score: 1,
      },
      {
        id: 2,
        name: "2",
        youtubeLink: "link2",
        score: 2,
      },
    ];

    jest.spyOn(Math, "random").mockReturnValue(fixedRandomValue);
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce(recommendations);

    await recommendationService.getRandom();
    expect(Math.random).toBeCalledTimes(2);
    expect(recommendationRepository.findAll)
    .toBeCalledWith({ score: 10, scoreFilter: "gt" }); 
  });

  it("should correctly call getRandom() for random = 0.9", async () => {
    const fixedRandomValue: number = 0.9;
    const recommendations: Recommendation[] = [
      {
        id: 1,
        name: "1",
        youtubeLink: "link1",
        score: 1,
      },
      {
        id: 2,
        name: "2",
        youtubeLink: "link2",
        score: 2,
      },
    ];

    jest.spyOn(Math, "random").mockReturnValue(fixedRandomValue);
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce(recommendations);

    await recommendationService.getRandom();
    expect(Math.random).toBeCalledTimes(2);
    expect(recommendationRepository.findAll)
    .toBeCalledWith({ score: 10, scoreFilter: "lte" }); 
  });

  it("should correctly call getRandom() for random = 0.5 but without filtered recommendations", async () => {
    const fixedRandomValue: number = 0.5;
    
    jest.spyOn(Math, "random").mockReturnValue(fixedRandomValue);
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([]);

    const result = recommendationService.getRandom();
    expect(Math.random).toBeCalledTimes(1);
    expect(recommendationRepository.findAll).toBeCalledTimes(1);
    expect(result).rejects.toEqual({ type: "not_found", message: "" });
  });


});