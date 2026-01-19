import childrenService from '@/services/childrenService'
import { NextResponse } from 'next/server'

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export async function GET(request, { params }) {
  const clubYearLabel = params['club_year_label']
  const children = await childrenService.listByClubYear(clubYearLabel)
  return NextResponse.json(children)
}
