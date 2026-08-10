'use client'
import { useParams, useRouter } from 'next/navigation'
import ResourcePage from '@/components/pages/ResourcePage'
import { fromSnakeCaseToTitleCase } from '@/utils/stringUtils'
import { transformClass } from '@/utils/transformUtils'
import { fromDateToString } from '@/utils/dateUtils'

export default function View({ classData }) {
  const { club_year_label: clubYearLabel, class_name: className } = useParams()
  const router = useRouter()
  const cls = classData ? transformClass(classData) : null
  const loading = false

  const title = className ? fromSnakeCaseToTitleCase(className) : 'Class'
  const instructorName = cls ? `${cls.instructorFirstName ?? ''} ${cls.instructorLastName ?? ''}`.trim() || '—' : '—'

  const breadcrumbs = [{ label: 'Classes', href: `/${clubYearLabel}/classes` }, { label: title }]

  const fields = cls
    ? [
        { label: 'Instructor', value: instructorName },
        { label: 'Adventurers', value: cls.children?.length ?? 0 },
        { label: 'Awards', value: cls.awards?.length ?? 0 },
      ]
    : []

  const relatedCards = [
    {
      title: 'Adventurers',
      badge: cls?.children?.length ?? 0,
      headers: [{ key: 'name', label: 'Name', sortable: false }],
      data: (cls?.children ?? []).map((c) => ({
        id: c.id,
        name: `${c.firstName} ${c.lastName}`,
      })),
      loading,
      onRowClick: (item) => router.push(`/${clubYearLabel}/adventurers/${item.id}`),
    },
    {
      title: 'Awards',
      badge: cls?.awards?.length ?? 0,
      headers: [
        { key: 'name', label: 'Award', sortable: false },
        { key: 'type', label: 'Type', sortable: false },
      ],
      data: (cls?.awards ?? []).map((a) => ({
        id: a.id,
        name: a.name ?? '—',
        type: a.type ? fromSnakeCaseToTitleCase(a.type) : '—',
      })),
      loading,
    },
    {
      title: 'Events',
      badge: cls?.events?.length ?? 0,
      headers: [
        { key: 'name', label: 'Event', sortable: false },
        { key: 'eventDate', label: 'Date', sortable: false },
      ],
      data: (cls?.events ?? []).map((e) => ({
        id: e.id,
        name: e.name ?? '—',
        eventDate: e.eventDate ? fromDateToString(e.eventDate) : '—',
      })),
      loading,
    },
  ]

  return (
    <ResourcePage
      breadcrumbs={breadcrumbs}
      title={title}
      loading={loading}
      fields={fields}
      relatedCards={relatedCards}
      imageUrl={cls?.imageUrl}
      imagePadding={cls?.imagePadding}
    />
  )
}
