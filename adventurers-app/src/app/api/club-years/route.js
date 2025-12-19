import clubYearService from '@/services/clubYearService'
import { NextResponse } from 'next/server'

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export async function GET() {
  const clubYearList = await clubYearService.list()
  return NextResponse.json(clubYearList)
}

export async function POST(request) {
  const newClubYearData = await request.json()
  const clubYearRecord = await clubYearService.create(newClubYearData)

  return NextResponse.json(clubYearRecord ?? {})
}
