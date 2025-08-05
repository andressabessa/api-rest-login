module.exports = {
  e2e: {
    baseUrl: process.env.FRONTEND_URL,
    reporter: 'cypress-mochawesome-reporter',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require('cypress-mochawesome-reporter/plugin')(on)
    },
  },
};
