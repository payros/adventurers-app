import sql from 'src/lib/postgres'

async function list() {
  try {
    const result = await sql`SELECT * FROM adv_db.club_years ORDER BY start_date DESC`
    return result
  } catch (err) {
    console.error(err)
  }

  return []
}

async function create(clubYear) {
  console.log('clubYear in service', clubYear)
  // Call the database and insert a new club year
  try {
    const result = await sql`
      INSERT INTO adv_db.club_years (club_name, start_date, end_date, label)
      VALUES (${clubYear.clubName}, ${clubYear.startDate}, ${clubYear.endDate}, ${clubYear.label})
      RETURNING *`
    return result
  } catch (err) {
    console.error(err)
  }
}

const clubYearService = {
  list,
  create,
}

export default clubYearService
