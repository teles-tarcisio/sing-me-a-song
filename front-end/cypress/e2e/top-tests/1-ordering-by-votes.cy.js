/* eslint-disable no-undef */
/// <reference types="cypress" />

const BASE_URL = 'http://localhost:3000/top';
const API_URL = 'http://localhost:5000/recommendations';

const songsArray = [
  {
    name: 'Audioslave: Wide Awake',
    youtubeLink: 'https://youtu.be/zA3pE_cLUdU',
  },
  {
    name: 'Barão Vermelho: MTV Ao Vivo',
    youtubeLink: 'https://youtu.be/o6LCGvteAv0',
  },
  {
    name: 'Casuarina: Ponto de Vista',
    youtubeLink: 'https://www.youtube.com/watch?v=1dmQmMUdMt8',
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

    cy.intercept('GET', `${API_URL}/top/10`).as('getTopTen');
    cy.wait('@getTopTen');

    songsArray.forEach((musicVideo) => {
      cy.get('article').contains(musicVideo.name)
        .should('be.visible')
        .parent()
        .find('div:nth-child(3)')
        .find('svg:nth-child(1)')
        .click();
    });

    cy.get('article').contains(songsArray[2].name)
      .should('be.visible')
      .parent()
      .find('div:nth-child(3)')
      .find('svg:nth-child(1)')
      .click();

    cy.get('article').contains(songsArray[2].name)
      .should('be.visible')
      .parent()
      .find('div:nth-child(3)')
      .find('svg:nth-child(1)')
      .click();

    // falta "ver" se o de casuarina tá no topo
    cy.get('article:first').find('div:nth-child(3)').contains('3');
  });
});
