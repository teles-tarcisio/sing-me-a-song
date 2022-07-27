/// <reference types="cypress" />
import { faker } from "@faker-js/faker";

const BASE_URL = 'http://localhost:3000';

describe("/home - send a song", () => {
  beforeEach(() => {
    cy.resetDatabase();
  });
  
  /*
  afterEach(() => {
    cy.resetDatabase();
  });
  */

  it("should succesfully send a new song", () => {
    const newSong = {
      name: faker.random.words(4),
      youtubeLink: `https://www.youtube.com/${faker.random.alpha(10)}`,
    };

    cy.visit(BASE_URL);

    cy.get('input[id="songName"]').type(newSong.name);
    cy.get('input[id="songLink"]').type(newSong.youtubeLink);

    cy.intercept("GET", "/recommendations").as('getRecommendations');

    cy.get('button[id="sendSong"]').click();

    cy.wait("@getRecommendations");
    cy.get("article").contains(newSong.name).should("be.visible");
  });
});