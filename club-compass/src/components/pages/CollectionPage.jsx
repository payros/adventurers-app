'use client'
import TableCard from '@/components/TableCard'
import PageLayout from '@/components/PageLayout'
import PageTransition from '@/components/PageTransition'

/**
 * CollectionPage — Single full-width table card
 * @param {Array} breadcrumbs
 * @param {string} clubName
 * @param {ReactNode} actions
 * @param {string} title
 * @param {string} description
 * @param {Array} headers
 * @param {Array} data
 * @param {boolean} loading
 * @param {function} onRowClick
 * @param {*} badge
 * @param {string} sortBy
 * @param {string} sortDirection
 * @param {function} handleSort
 * @param {function} handleSearch
 * @param {string} searchPlaceholder
 */
export default function CollectionPage({
  breadcrumbs = [],
  clubName,
  actions,
  title,
  description,
  headers,
  data,
  loading,
  onRowClick,
  badge,
  sortBy,
  sortDirection,
  handleSort,
  handleSearch,
  searchPlaceholder,
}) {
  return (
    <PageLayout breadcrumbs={breadcrumbs} actions={actions} clubName={clubName}>
      <PageTransition>
        <TableCard
          title={title}
          description={description}
          headers={headers}
          data={data}
          loading={loading}
          onRowClick={onRowClick}
          badge={badge}
          sortBy={sortBy}
          sortDirection={sortDirection}
          handleSort={handleSort}
          handleSearch={handleSearch}
          searchPlaceholder={searchPlaceholder}
          width="full"
          maxH="calc(100vh - 200px)"
        />
      </PageTransition>
    </PageLayout>
  )
}
