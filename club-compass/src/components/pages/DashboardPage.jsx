'use client'
import TableCard from '@/components/TableCard'
import PageLayout from '@/components/PageLayout'
import PageTransition from '@/components/PageTransition'

/**
 * DashboardPage — Grid of multiple table/info cards
 * @param {Array} breadcrumbs
 * @param {ReactNode} actions
 * @param {Array} cards - [{ title, headers, data, loading, badge, sortBy, sortDirection, handleSort, onRowClick }]
 * @param {ReactNode} extraContent - optional extra elements (stat rows, etc.)
 */
export default function DashboardPage({ breadcrumbs = [], actions, cards = [], extraContent }) {
  return (
    <PageLayout breadcrumbs={breadcrumbs} actions={actions}>
      <PageTransition>
        {extraContent}
        <div className="cards-grid" style={{ marginTop: extraContent ? '1.25rem' : 0 }}>
          {cards.map((card, i) => (
            <TableCard key={i} {...card} maxH={card.maxH ?? '300px'} hideHeaders={true} />
          ))}
        </div>
      </PageTransition>
    </PageLayout>
  )
}
