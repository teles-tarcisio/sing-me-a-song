/* eslint-disable no-undef */
/// <reference types="cypress" />

const BASE_URL = 'http://localhost:3000/random';
const API_URL = 'http://localhost:5000/recommendations';

const songsArray = [
  {
    name: 'Falamansa - Xote dos Milagres',
    youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
  },
];

beforeEach(() => {
  cy.resetDatabase();
  songsArray.forEach((musicVideo) => {
    cy.populateDatabase(musicVideo);
  });
});

describe('/top - test video ordering by votes', () => {
  it('should succesfully change the recommendations order', () => {
    cy.visit(BASE_URL);

    cy.intercept('GET', `${API_URL}/random`).as('getRandom');
    cy.wait('@getRandom').then((interception) => {
      cy.wrap(interception).its('response.statusCode').should('equal', 200);
      cy.wrap(interception).its('response.body.name').should('equal', songsArray[0].name);
    });
    cy.get('article').contains(songsArray[0].name).should('be.visible');
  });
});
