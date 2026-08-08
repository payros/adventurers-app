'use client'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import useChildren from '@/hooks/useChildren'
import CollectionPage from '@/components/pages/CollectionPage'

const headers = [
  { key: 'profileImageUrl', label: '', sortable: false, type: 'avatar' },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'parents', label: 'Parents', sortable: true },
  { key: 'age', label: 'Age', sortable: true },
  { key: 'grade', label: 'Grade', sortable: true },
  { key: 'class', label: 'Class', sortable: true },
  { key: 'sex', label: 'Sex', sortable: true },
  { key: 'allergies', label: 'Allergies', sortable: false },
  { key: 'medicalConditions', label: 'Medical Conditions', sortable: false },
  { key: 'attendance', label: 'Attendance', sortable: false },
  { key: 'awardsEarned', label: 'Awards Earned', sortable: false },
]

export default function View({ clubYear }) {
  const clubYearLabel = useParams()['club_year_label']
  const router = useRouter()
  const [sort, setSort] = useState({ by: null, direction: 'asc' })
  const [filter, setFilter] = useState('')
  const { children, loading: loadingChildren } = useChildren(clubYear, { ...sort, filter })

  function handleSort(by) {
    setSort((prev) => ({
      by,
      direction: prev.by === by && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const breadcrumbs = [{ label: 'Adventurers' }]

  return (
    <CollectionPage
      breadcrumbs={breadcrumbs}
      clubName={`${clubYearLabel} Club`}
      title="Adventurers"
      description={`${children?.length ?? 0} children enrolled in the ${clubYearLabel} club year`}
      headers={headers}
      data={children}
      loading={loadingChildren}
      badge={children?.length ?? 0}
      sortBy={sort.by}
      sortDirection={sort.direction}
      handleSort={handleSort}
      handleSearch={(val) => setFilter(val)}
      onRowClick={(item) => router.push(`/${clubYearLabel}/adventurers/${item.id}`)}
      searchPlaceholder="Search by name..."
    />
  )
}
