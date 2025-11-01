/// <reference types="cypress" />

import { SEL } from './selectors';
declare global {
  namespace Cypress {
    interface Chainable {
      setAuthTokens(): Chainable<void>;
      clearAuthTokens(): Chainable<void>;
      addIngredientById(id: string): Chainable<void>;
      openIngredientModalById(id: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('setAuthTokens', () => {
  window.localStorage.setItem('accessToken', 'test-access-token');
  cy.setCookie('refreshToken', 'test-refresh-token');
});

Cypress.Commands.add('clearAuthTokens', () => {
  window.localStorage.removeItem('accessToken');
  cy.clearCookie('refreshToken');
});

Cypress.Commands.add('addIngredientById', (id: string) => {
  cy.get(`${SEL.ingredientCard}[data-id="${id}"]`)
    .as('ingCard')
    .within(() => {
      cy.get(SEL.ingredientAddBtn).find('button').click({ force: true });
    });
});

Cypress.Commands.add('openIngredientModalById', (id: string) => {
  cy.get(`${SEL.ingredientCard}[data-id="${id}"]`).click();
});

export {};
