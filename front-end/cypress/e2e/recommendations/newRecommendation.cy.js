//import { faker } from "@faker-js/faker";

describe("Recommendations", () => {
  it("should succesfully register a new video recommendation", () => {
    /*
    faker.random.words(), //default is 1-3 words
    */
    const newVideo = {
      name: "01 Casuarina - Ponto de Vista",
      youtubeLink: "https://www.youtube.com/watch?v=1dmQmMUdMt8",
    };

    cy.visit("http://localhost:3000");
  });

});