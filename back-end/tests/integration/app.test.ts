import app from "../../src/app.js";
import supertest from "supertest";
import { prisma } from "../../src/database.js";
import { Recommendation } from "@prisma/client";
import recommendationFactory from "../factories/recommendationFactory.js";
import scenariosFactory from "../factories/scenariosFactory.js";
import dotenv from "dotenv";
dotenv.config();


const BASE_URL = "/recommendations";
const APP = supertest(app);

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY;`;
})

describe("POST /recommendations test suite", () => {
  it("registers a new recommendation given valid body", async () => {
    const newRecommendation = recommendationFactory.createFakeRecommendation();

    const response = await APP.post(BASE_URL).send(newRecommendation);
    expect(response.statusCode).toBe(201);

    const persistedRecommendation = await prisma.recommendation.findUnique({
      where: {
        name: newRecommendation.name,
      },
    });
    expect(persistedRecommendation.name).toBe(newRecommendation.name);
  });

  it("returns 422 when trying to register recommendation without name", async () => {
    const namelessRecommendation = recommendationFactory.createFakeRecommendation();
    namelessRecommendation.name = "";

    const response = await APP.post("/recommendations").send(namelessRecommendation);
    expect(response.statusCode).toBe(422);

    const notFoundRecommendation = await prisma.recommendation.findFirst({
      where: {
        name: "",
        youtubeLink: namelessRecommendation.youtubeLink,
      },
    });
    expect(notFoundRecommendation).toBe(null);
  });

  it("returns 422 when trying to register recommendation with invalid link", async () => {
    const invalidLinkRecommendation = recommendationFactory.createFakeRecommendation();
    invalidLinkRecommendation.youtubeLink = "https://www.invlaidlink.com";

    const response = await APP.post("/recommendations").send(invalidLinkRecommendation);
    expect(response.statusCode).toBe(422);

    const notFoundRecommendation = await prisma.recommendation.findFirst({
      where: {
        name: "",
        youtubeLink: invalidLinkRecommendation.youtubeLink,
      },
    });
    expect(notFoundRecommendation).toBe(null);
  });

  it("correctly increments a recommendation score", async () => {
    const newRecommendation = recommendationFactory.createFakeRecommendation();
    const insertedRecommendation = await scenariosFactory.registerOneRecommendation(newRecommendation);
    const targetId = insertedRecommendation.id;
    const previousScore = insertedRecommendation.score;

    const response = await APP.post(BASE_URL + `/${targetId}/upvote`);
    expect(response.statusCode).toBe(200);

    const updatedScore = await prisma.recommendation.findUnique({
      where: {
        id: insertedRecommendation.id,
      },
    });
    expect(updatedScore.score).toEqual(previousScore + 1);
  });

  it("correctly decrements a recommendation score", async () => {
    const newRecommendation = recommendationFactory.createFakeRecommendation();
    const insertedRecommendation = await scenariosFactory.registerOneRecommendation(newRecommendation);
    const targetId = insertedRecommendation.id;
    const previousScore = insertedRecommendation.score;

    const response = await APP.post(BASE_URL + `/${targetId}/downvote`);
    expect(response.statusCode).toBe(200);

    const updatedScore = await prisma.recommendation.findUnique({
      where: {
        id: insertedRecommendation.id,
      },
    });
    expect(updatedScore.score).toEqual(previousScore - 1);
  });
});


describe("GET /recommendations test suite", () => {
  it("correctly receives 10/13 recommendations", async () => {
    const recommendationsArray13 = await scenariosFactory.addRecommendationsScenario(13);

    const response = await APP.get(BASE_URL);
    const size = response.body.length;
    expect(size).toEqual(10);
  });

  it("correctly receives 07/10 recommendations", async () => {
    const recommendationsArray7 = await scenariosFactory.addRecommendationsScenario(7);

    const response = await APP.get(BASE_URL);
    const size = response.body.length;
    expect(size).toEqual(7);
  });

  it("correctly receives recommendation by id", async () => {
    await scenariosFactory.addRecommendationsScenario(12);
    const targetId = 9;

    const response = await APP.get(BASE_URL + `/${targetId}`);
    expect(response.body.id).toEqual(targetId);
  });

  it("returns 404 for recommendation with inexistent id", async () => {
    await scenariosFactory.addRecommendationsScenario(4);
    const targetId = 6;

    const response = await APP.get(BASE_URL + `/${targetId}`);
    expect(response.statusCode).toBe(404);
  });

  it("returns 500 for recommendation with invalid id parameter", async () => {
    const targetId = "Z";
    const response = await APP.get(BASE_URL + `/${targetId}`);
    expect(response.statusCode).toBe(500);
  });

  it("correctly receives random recommendation", async () => {
    await scenariosFactory.addRecommendationsScenario(14);

    const response = await APP.get(BASE_URL + "/random");
    const randomRecommendation: Recommendation = response.body;
    expect(randomRecommendation.id).toBeGreaterThanOrEqual(1);
    expect(randomRecommendation.id).toBeLessThanOrEqual(14);

  });

  it("returns 404 for '/random' but without existent recommendations", async () => {
    const response = await APP.get(BASE_URL + "/random");
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({});
  });

  it("correctly receives sorted top X recommendations", async () => {
    const amount = 6;
    const total = 15;
    await scenariosFactory.addScoredRecommendationsScenario(total);

    const response = await APP.get(BASE_URL + `/top/${amount}`);
    const recommendationsArray = response.body;
    expect(recommendationsArray.length).toEqual(amount);
    
    const sorted = __checkScoreSorted(recommendationsArray);
    expect(sorted).toEqual(true);
  });

});

function __checkScoreSorted(targetArray: any[]): boolean {
  let sorted = true;
  for (let i = 0; i < targetArray.length - 1; i++) {
    if (targetArray[i].score < targetArray[i + 1].score) {
      sorted = false;
      break;
    }
  }

  return sorted;
}

afterAll(async () => {
  await prisma.$disconnect();
});