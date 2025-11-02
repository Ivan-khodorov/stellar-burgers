/// <reference types="cypress" />
import { SEL } from '../support/selectors';
describe('Конструктор бургера — добавление ингредиентов (клик по реальной кнопке)', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.get(SEL.constructorRoot).as('constructor');
    cy.get(SEL.constructorFillings).as('fills');
    cy.get('@constructor').should('exist');
    cy.get('@fills').should('exist');
  });

  it('добавляет одну булку и одну начинку в конструктор', () => {
    cy.addIngredientById('643d69a5c3f7b9001cfa093c');

    cy.get(SEL.constructorBunTop).should(
      'contain.text',
      'Краторная булка N-200i'
    );
    cy.get(SEL.constructorBunBottom).should(
      'contain.text',
      'Краторная булка N-200i'
    );

    cy.get(SEL.totalPrice).should('have.text', '2510');

    cy.addIngredientById('643d69a5c3f7b9001cfa0941');

    cy.get(SEL.constructorFillings).should(
      'contain.text',
      'Биокотлета из марсианской Магнолии'
    );
    cy.get(SEL.totalPrice).should('have.text', '2934');
  });

  it('минимальный сценарий: добавление одной начинки', () => {
    cy.addIngredientById('643d69a5c3f7b9001cfa0941');

    cy.get(SEL.constructorFillings).should(
      'contain.text',
      'Биокотлета из марсианской Магнолии'
    );
  });
});
