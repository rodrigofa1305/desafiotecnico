const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://serverest.dev/#'
  },
  fixturefolder: false,
  video: false,
})
