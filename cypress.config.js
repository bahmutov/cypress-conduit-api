const {defineConfig} = require('cypress')

module.exports = defineConfig({
  failOnStatusCode: false,
  watchForFileChanges: true,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
