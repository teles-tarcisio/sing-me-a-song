/* eslint-disable no-undef */
/// <reference types="cypress" />

const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:5000';

const newSong = {
  name: 'Strange Dark House Mix',
  youtubeLink: 'https://www.youtube.com/watch?v=98a_uq0r7RQ',
};

beforeEach(() => {
  cy.resetDatabase();
});

describe('/home - downvote a video', () => {
  it('should succesfully downvote a video', () => {
    cy.visit(BASE_URL);
    cy.request('POST', `${API_URL}/recommendations`, newSong).then((response) => {
      // eslint-disable-next-line no-console
      console.log(response.body, response.status);
    });

    cy.intercept('GET', `${API_URL}/recommendations`).as('getRecommendations');
    cy.wait('@getRecommendations');

    cy.get('article').contains(newSong.name)
      .should('be.visible')
      .parent()
      .find('div:nth-child(3)')
      .contains('0');

    cy.get('article').contains(newSong.name)
      .should('be.visible')
      .parent()
      .find('div:nth-child(3)')
      .find('svg:nth-child(2)')
      .click();

    cy.get('article').contains(newSong.name)
      .should('be.visible')
      .parent()
      .find('div:nth-child(3)')
      .contains('-1');
  });
});
