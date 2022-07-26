// import { faker } from "@faker-js/faker";

const BASE_URL = 'http://localhost:3000';

const songA = {
  name: 'Casuarina: Ponto de Vista',
  youtubeLink: 'https://www.youtube.com/watch?v=1dmQmMUdMt8',
};

describe('/home - send a song', () => {
  it('should succesfully send a new song', () => {
    cy.visit(BASE_URL);

    cy.get('input[id="songName"]').type(songA.name);
    cy.get('input[id="songLink"]').type(songA.youtubeLink);

    cy.intercept('GET', '/recommendations').as('getRecommendations');

    cy.get('button[id="sendSong"]').click();

    cy.wait('@getRecommendations');
    cy.get('article').contains(songA.name).should('be.visible');
  });
});