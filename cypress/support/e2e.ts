/// <reference types="cypress" />
import './commands';

export {};

Cypress.on('uncaught:exception', () => false);
