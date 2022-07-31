/// <reference types="cypress" />

const BASE_URL = 'http://localhost:3000';

beforeEach(() => {
  cy.resetDatabase();
});

describe("/home - send a song", () => {
  it("should succesfully send a new song", () => {
    const newSong = {
      name: 'Casuarina: Ponto de Vista',
      youtubeLink: 'https://www.youtube.com/watch?v=1dmQmMUdMt8',
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