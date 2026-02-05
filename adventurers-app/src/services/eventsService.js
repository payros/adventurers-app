import sql from 'src/lib/postgres'

async function listByClubYear(clubYearLabel) {
  try {
    const result = await sql`SELECT *
                            FROM adv_db.events as ev
                            JOIN adv_db.club_years as cy ON ev.club_year_id = cy.id
                            WHERE cy.label = ${clubYearLabel}`

    return result
  } catch (err) {
    console.error(err)
  }

  return []
}

const eventsService = {
  listByClubYear,
}

export default eventsService