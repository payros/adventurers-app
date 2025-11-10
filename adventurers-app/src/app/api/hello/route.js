import sql from 'src/lib/postgres'

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export async function queryDatabase() {
  try {
    const result = await sql`SELECT count(*)::int FROM adv_db.users`
    const numUsers = result[0].count
    return { props: { numUsers } }
  } catch (err) {
    console.error(err)
  }

  return { props: { numUsers: 0 } }
}

export async function GET(request) {
  const { props } = await queryDatabase()
  return NextResponse.json(props)
}
