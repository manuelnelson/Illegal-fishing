let config = require('dotenv').config();
const { Client } = require('pg')
console.log(config.parsed.PGDATABASE)
const client = new Client({
  user: config.parsed.PGUSER,
  host: config.parsed.PGHOST,//'boat.colorado.edu',
  database: config.parsed.PGDATABASE,//'vbd23',
  password: config.parsed.PGPASSWORD,//'viirs2018',
  port: 5432,
}
)

const connect = async () => {
  await client.connect()
}



module.exports = {connect, client}