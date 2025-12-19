import postgres from 'postgres'

const sql = postgres({
  host: process.env.POSTGRES_HOST,
  port: 5432,
  database: process.env.POSTGRES_DATABASE,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  // Transform the column names only from camel case
  transform: postgres.camel,
})
console.log(
  'Postgres connected to ' +
    process.env.POSTGRES_HOST +
    ':' +
    process.env.POSTGRES_PORT +
    '/' +
    process.env.POSTGRES_DATABASE
)
export default sql
