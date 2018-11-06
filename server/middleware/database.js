const { Client } = require('pg')
console.log(process.env.PGDATABASE)
const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,//'boat.colorado.edu',
  database: process.env.PGDATABASE,//'vbd23',
  password: process.env.PGPASSWORD,//'viirs2018',
  port: 5432,
}
)

const connect = async () => {
  await client.connect()
}



module.exports = {connect, client}