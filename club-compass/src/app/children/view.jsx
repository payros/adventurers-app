'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useChildren from '@/hooks/useChildren'
import CollectionPage from '@/components/pages/CollectionPage'

const headers = [
  { key: 'profileImageUrl', label: '', sortable: false, type: 'avatar' },
  { key: 'name', label: 'Name', sortable: false },
  { key: 'age', label: 'Age', sortable: false },
  { key: 'sex', label: 'Sex', sortable: false },
]

export default function View() {
  const [filter, setFilter] = useState('')
  const { children, loading } = useChildren(null, { filter })
  const router = useRouter()

  const breadcrumbs = [{ label: 'Children' }]

  return (
    <CollectionPage
      breadcrumbs={breadcrumbs}
      title="Children"
      description="All children on record"
      headers={headers}
      data={children}
      loading={loading}
      badge={children?.length ?? 0}
      onRowClick={(item) => router.push(`/children/${item.id}`)}
      handleSearch={(val) => setFilter(val)}
      searchPlaceholder="Search by name..."
    />
  )
}
