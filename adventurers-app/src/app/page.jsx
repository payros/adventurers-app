import { redirect } from 'next/navigation'

// import clubYearService from "@/services/clubYearService"

const Home = async () => {

  const clubYears = await clubYearService.list()

  if (clubYears.length > 0) {
    const latestClubYear = clubYears[0]
    redirect(`/${latestClubYear.label}/dashboard`)
  } else {
    redirect('/club-years/new')
  }

  return <h1>Loading...</h1>
}


export default Home;