'use strict'

const nuxt = require('./nuxt')
const MapController = require('../controllers/MapController')
module.exports = function () {
  // Add your custom middleware here. Remember, that
  // just like Express the order matters, so error
  // handling middleware should go last.
  const app = this
  app.get('/api/map', MapController.get)
  app.use(nuxt)
}
