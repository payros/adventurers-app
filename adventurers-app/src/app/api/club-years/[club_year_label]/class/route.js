import classService from '@/services/classService'
import { NextResponse } from 'next/server'

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export async function GET(request, { params }) {
  const clubYearLabel = params['club_year_label']
  const class_ = await classService.listByClubYear(clubYearLabel)
  return NextResponse.json(class_)
}
