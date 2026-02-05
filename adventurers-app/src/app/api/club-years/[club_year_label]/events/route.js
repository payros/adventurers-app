import eventsService from '@/services/eventsService'
import { NextResponse } from 'next/server'

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export async function GET(request, { params }) {
  const clubYearLabel = params['club_year_label']
  const events = await eventsService.listByClubYear(clubYearLabel)
  return NextResponse.json(events)
}
