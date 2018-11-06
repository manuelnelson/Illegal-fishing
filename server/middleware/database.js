const { Client } = require('pg')
const client = new Client({
  user: 'readonly',
  host: 'boat.colorado.edu',
  database: 'vbd23',
  password: 'viirs2018',
  port: 5432,
}
)

const connect = async () => {
  await client.connect()
}



module.exports = {connect, client}