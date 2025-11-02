/// <reference types="cypress" />
import { SEL } from '../support/selectors';

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
    cy.addIngredientById('643d69a5c3f7b9001cfa093c'); // булка
    cy.addIngredientById('643d69a5c3f7b9001cfa0941'); // начинка

    cy.get(SEL.totalPrice)
      .invoke('text')
      .then((t) => {
        expect(Number(t.trim())).to.be.greaterThan(0);
      });

    cy.contains('Оформить заказ').click();

    cy.wait('@createOrder', { timeout: 15000 })
      .its('response.statusCode')
      .should('eq', 200);

    cy.get(SEL.modal).should('be.visible');

    cy.fixture('order.json').then((o) => {
      const num =
        o?.order?.number ??
        (Array.isArray(o?.orders) ? o.orders[0]?.number : undefined);
      expect(num).to.be.a('number');
      cy.contains(String(num)).should('be.visible');
    });

    cy.get(SEL.modalClose).click();
    cy.get(SEL.modal).should('not.exist');
    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
    cy.get(SEL.totalPrice).should('have.text', '0');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.window().then((w) => w.localStorage.removeItem('refreshToken'));
  });
});
