'use client'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ResourcePage from '@/components/pages/ResourcePage'
import { fromDateOfBirthToAge } from '@/utils/dateUtils'

export default function View({ parent }) {
  const { id } = useParams()
  const router = useRouter()
  const [children, setChildren] = useState([])
  const [loadingChildren, setLoadingChildren] = useState(true)

  useEffect(() => {
    fetch(`/api/parents/${id}/children`)
      .then((r) => r.json())
      .then((data) => {
        setChildren(data)
        setLoadingChildren(false)
      })
      .catch(() => setLoadingChildren(false))
  }, [id])

  const name = parent ? `${parent.firstName} ${parent.lastName}` : 'Parent'

  const breadcrumbs = [{ label: 'Parents', href: '/parents' }, { label: name }]

  const fields = parent
    ? [
        { label: 'First Name', value: parent.firstName },
        { label: 'Last Name', value: parent.lastName },
        { label: 'Email', value: parent.email ?? '—' },
        { label: 'Phone', value: parent.phone ?? '—' },
        { label: 'Address', value: parent.address ?? '—' },
      ]
    : []

  const relatedCards = [
    {
      title: 'Children',
      badge: children.length,
      headers: [
        { key: 'name', label: 'Name', sortable: false },
        { key: 'age', label: 'Age', sortable: false },
        { key: 'sex', label: 'Sex', sortable: false },
      ],
      data: children.map((c) => ({
        id: c.id,
        name: `${c.firstName} ${c.lastName}`,
        age: c.dateOfBirth ? fromDateOfBirthToAge(c.dateOfBirth) : '—',
        sex: c.sex ?? '—',
      })),
      loading: loadingChildren,
      onRowClick: (item) => router.push(`/children/${item.id}`),
    },
  ]

  return (
    <ResourcePage
      breadcrumbs={breadcrumbs}
      title={name}
      subtitle="Parent / Guardian"
      fields={fields}
      relatedCards={relatedCards}
    />
  )
}
