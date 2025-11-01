/// <reference types="cypress" />
import { expect as chaiExpect } from 'chai';

describe('Создание заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients*', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    cy.setCookie('accessToken', 'Bearer FAKE_ACCESS');
    cy.window().then((w) =>
      w.localStorage.setItem('refreshToken', 'FAKE_REFRESH')
    );

    cy.intercept('GET', '**/auth/user*', { fixture: 'user.json' }).as(
      'getUser'
    );

    cy.intercept('POST', '**/orders*', { fixture: 'order.json' }).as(
      'createOrder'
    );

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');

    cy.contains('Cypress Tester', { timeout: 10000 }).should('be.visible');
  });

  it('собирает бургер и оформляет заказ, проверяет номер и очистку конструктора', () => {
    cy.get(
      '[data-cy="ingredient-card"][data-id="643d69a5c3f7b9001cfa093c"]'
    ).within(() => {
      cy.get('[data-cy="add-ingredient"]')
        .find('button')
        .click({ force: true });
    });

    cy.get(
      '[data-cy="ingredient-card"][data-id="643d69a5c3f7b9001cfa0941"]'
    ).within(() => {
      cy.get('[data-cy="add-ingredient"]')
        .find('button')
        .click({ force: true });
    });

    cy.get('[data-cy="total-price"]')
      .invoke('text')
      .then((t) => {
        chaiExpect(Number(t.trim())).to.be.greaterThan(0);
      });

    cy.contains('Оформить заказ').click();

    cy.wait('@createOrder', { timeout: 15000 })
      .its('response.statusCode')
      .should('eq', 200);

    cy.get('[data-cy="modal"]').should('be.visible');

    cy.fixture('order.json').then((o) => {
      const num =
        o?.order?.number ??
        (Array.isArray(o?.orders) ? o.orders[0]?.number : undefined);
      chaiExpect(num).to.be.a('number');
      cy.contains(String(num)).should('be.visible');
    });

    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
    cy.get('[data-cy="total-price"]').should('have.text', '0');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.window().then((w) => w.localStorage.removeItem('refreshToken'));
  });
});
