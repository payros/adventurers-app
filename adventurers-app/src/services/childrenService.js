import sql from 'src/lib/postgres'

async function listByClubYear(clubYearLabel) {
  try {
    const result = await sql`SELECT ch.id, cy.label, ch.first_name, ch.last_name,cl.class
                            FROM adv_db.classes_children as cc
                            JOIN adv_db.club_years as cy ON cc.club_year_id = cy.id
                            JOIN adv_db.children as ch ON cc.child_id = ch.id
                            JOIN adv_db.classes as cl ON cc.class_id = cl.id
                            WHERE cy.label = ${clubYearLabel}`
    return result
  } catch (err) {
    console.error(err)
  }

  return []
}

const childrenService = {
  listByClubYear,
}

export default childrenService
