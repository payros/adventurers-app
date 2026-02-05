import sql from 'src/lib/postgres'

async function listByClubYear(clubYearLabel) {
  try {
    const result = await sql`SELECT *, sf.first_name AS instructor_first_name, sf.last_name AS instructor_last_name
                            FROM adv_db.classes as cl
                            JOIN adv_db.club_years as cy ON cl.club_year_id = cy.id
                            JOIN adv_db.staff as sf ON cl.instructor_id = sf.id
                            WHERE cy.label = ${clubYearLabel}`

    return result
  } catch (err) {
    console.error(err)
  }

  return []
}

const classService = {
  listByClubYear,
}

export default classService