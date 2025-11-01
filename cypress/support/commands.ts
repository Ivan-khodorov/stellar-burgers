/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      setAuthTokens(): Chainable<void>;
      clearAuthTokens(): Chainable<void>;
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

export {};
