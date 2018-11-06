'use strict'
const path = require('path')
const consola = require('consola')
const feathers = require('feathers')
const configuration = require('feathers-configuration')
const middleware = require('./middleware')
const db = require('./middleware/database');
const app = feathers()

app.configure(configuration(path.join(__dirname, './')))
  .configure(middleware)

const host = app.get('host')
const port = app.get('port')

process.on('nuxt:build:done', async (err) => {
  if (err) {
    consola.error(err)
    process.exit(1)
  }
  //connect database
  try {
    await db.connect();
  } catch (ex) {
    console.error(ex)
  }

  const server = app.listen(port)
  server.on('listening', () =>
    consola.ready({
      message: `Feathers application started on ${host}:${port}`,
      badge: true
    })
  )
})

module.exports = app
