import app from "../../src/app.js";
import supertest from "supertest";
import { prisma } from "../../src/database.js";
import recommendationFactory from "../factories/recommendationFactory.js";
import scenariosFactory from "../factories/scenariosFactory.js";
import dotenv from "dotenv";
dotenv.config();


const BASE_URL = "/recommendations";
const APP = supertest(app);

beforeEach(async () => {
  await prisma.recommendation.deleteMany();
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
    const insertedRecommendation = await scenariosFactory.registerRecommendation(newRecommendation);
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
    const insertedRecommendation = await scenariosFactory.registerRecommendation(newRecommendation);
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


describe("GET /recommendations", () => {
  it.todo("correctly receives 10/10 recommendations");
  it.todo("correctly receives 7/10 recommendations");
  it.todo("correctly receives 10/13 recommendations");

  it.todo("correctly receives recommendation by id");
  it.todo("returns XYZ for recommendation with invalid id");

  it.todo("correctly receives random recommendation");
  it.todo("returns 404 for 'random' but without existent recommendations");

  it.todo("correctly receives sorted top X recommendations");

});

afterAll(async () => {
  await prisma.$disconnect();
});