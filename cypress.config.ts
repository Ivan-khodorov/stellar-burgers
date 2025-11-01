import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4000',
    specPattern: 'cypress/e2e/**/*.cy.{ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    video: false,
    setupNodeEvents(on, config) {}
  },

  viewportWidth: 1366,
  viewportHeight: 768,

  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack'
    }
  }
});
