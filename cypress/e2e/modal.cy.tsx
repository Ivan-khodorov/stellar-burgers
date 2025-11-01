/// <reference types="cypress" />

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
      expect(ing, 'ингредиент из фикстуры найден').to.exist;

      cy.get(`[data-cy="ingredient-card"][data-id="${ing._id}"]`).click();

      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="modal-title"]').should(
        'contain.text',
        'Детали ингредиента'
      );

      cy.get('[data-cy="ingredient-name"]').should('have.text', ing.name);
      cy.contains(String(ing.calories));
      cy.contains(String(ing.proteins));
      cy.contains(String(ing.fat));
      cy.contains(String(ing.carbohydrates));

      cy.get('[data-cy="modal-close"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });

  it('закрывается по клику на крестик', () => {
    cy.get('[data-cy="ingredient-card"]').first().click();
    cy.get('[data-cy="modal"]').should('be.visible');

    cy.get('[data-cy="modal-close"]').click();

    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('закрывается по клику на оверлей', () => {
    cy.get('[data-cy="ingredient-card"]').first().click();
    cy.get('[data-cy="modal"]').should('be.visible');

    cy.get('[data-cy="modal-overlay"]').click({ force: true });

    cy.get('[data-cy="modal"]').should('not.exist');
  });
});
