/// <reference types="cypress" />
//import { faker } from "@faker-js/faker";

const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:5000';

const newSong = {
  name: 'Foo Fighters: The Pretender',
  youtubeLink: 'https://www.youtube.com/watch?v=SBjQ9tuuTJQ',
};

beforeEach(() => {
  cy.resetDatabase();
});

describe("/home - upvote a video", () => {
  it("should succesfully upvote a video", () => {
    cy.visit(BASE_URL);
    cy.request("POST", `${API_URL}/recommendations`, newSong).then((response) => {
      console.log(response.body, response.status);
    });

    cy.intercept("GET", `${API_URL}/recommendations`).as("getRecommendations");
    cy.wait("@getRecommendations");

    cy.get("article").contains(newSong.name)
      .should("be.visible")
      .parent()
      .find("div:nth-child(3)")
      .contains("0");

    cy.get("article").contains(newSong.name)
      .should('be.visible')
      .parent()
      .find('div:nth-child(3)')
      .find('svg:nth-child(1)')
      .click();

    cy.get('article').contains(newSong.name)
      .should('be.visible')
      .parent()
      .find('div:nth-child(3)')
      .contains('1');
  });
});