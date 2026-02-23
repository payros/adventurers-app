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


async function create(event) {
  // Call the database and insert a new event, returning the created event
  try {
    const result = await sql`
      INSERT INTO adv_db.events (title, event_date, award_ceremony,club_year_id)
      VALUES (${event.title}, ${event.event_date}, ${event.award_ceremony}, (SELECT id FROM adv_db.club_years WHERE label = ${event.club_year_label}))
      RETURNING *`
    return result
  } catch (err) {
    console.error(err)
  }
}


const eventsService = {
  create,
  listByClubYear,
}

export default eventsService