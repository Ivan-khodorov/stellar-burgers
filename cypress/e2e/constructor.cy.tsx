/// <reference types="cypress" />
describe('Конструктор бургера — добавление ингредиентов (клик по реальной кнопке)', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.get('[data-cy="constructor"]').should('exist');
    cy.get('[data-cy="constructor-fillings"]').should('exist');
  });

  it('добавляет одну булку и одну начинку в конструктор', () => {
    cy.get('[data-cy="ingredient-card"][data-id="643d69a5c3f7b9001cfa093c"]')
      .as('bunCard')
      .within(() => {
        cy.contains('button', 'Добавить')
          .should('be.visible')
          .click({ force: true });
      });

    cy.get('[data-cy="constructor-bun-top"]').should(
      'contain.text',
      'Краторная булка N-200i'
    );
    cy.get('[data-cy="constructor-bun-bottom"]').should(
      'contain.text',
      'Краторная булка N-200i'
    );

    cy.get('[data-cy="total-price"]').should('have.text', '2510');

    cy.get('[data-cy="ingredient-card"][data-id="643d69a5c3f7b9001cfa0941"]')
      .as('mainCard')
      .within(() => {
        cy.contains('button', 'Добавить')
          .should('be.visible')
          .click({ force: true });
      });

    cy.get('[data-cy="constructor-fillings"]').should(
      'contain.text',
      'Биокотлета из марсианской Магнолии'
    );
    cy.get('[data-cy="total-price"]').should('have.text', '2934');
  });

  it('минимальный сценарий: добавление одной начинки', () => {
    cy.get(
      '[data-cy="ingredient-card"][data-id="643d69a5c3f7b9001cfa0941"]'
    ).within(() => {
      cy.contains('button', 'Добавить')
        .should('be.visible')
        .click({ force: true });
    });
    cy.get('[data-cy="constructor-fillings"]').should(
      'contain.text',
      'Биокотлета из марсианской Магнолии'
    );
  });
});
