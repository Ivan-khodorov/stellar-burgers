/// <reference types="cypress" />
import { SEL } from '../support/selectors';

describe('Модальное окно ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients*', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('открывает модалку по клику и показывает данные именно выбранного ингредиента', () => {
    cy.fixture('ingredients.json').then(({ data }) => {
      const ing = data.find((x: any) => x._id === '643d69a5c3f7b9001cfa093c');
      expect(ing).to.exist;

      cy.openIngredientModalById(ing._id);

      cy.get(SEL.modal).should('be.visible');
      cy.get(SEL.modalTitle).should('contain.text', 'Детали ингредиента');

      cy.get(SEL.ingredientName).should('have.text', ing.name);
      cy.contains(String(ing.calories));
      cy.contains(String(ing.proteins));
      cy.contains(String(ing.fat));
      cy.contains(String(ing.carbohydrates));

      cy.get(SEL.modalClose).click();
      cy.get(SEL.modal).should('not.exist');
    });
  });

  it('закрывается по клику на крестик', () => {
    cy.get(SEL.ingredientCard).first().click();
    cy.get(SEL.modal).should('be.visible');
    cy.get(SEL.modalClose).click();
    cy.get(SEL.modal).should('not.exist');
  });

  it('закрывается по клику на оверлей', () => {
    cy.get(SEL.ingredientCard).first().click();
    cy.get(SEL.modal).should('be.visible');
    cy.get(SEL.modalOverlay).click({ force: true });
    cy.get(SEL.modal).should('not.exist');
  });
});
