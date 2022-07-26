import { faker } from "@faker-js/faker";

describe("Recommendations", () => {
  it("should succesfully register a new video recommendation", () => {
    const newVideo = {
      name: faker.random.words(),
      youtubeLink: `www.youtube.com/${faker.random.alpha(10)}`,
    };

    cy.visit("http://localhost:3000");
  });

});