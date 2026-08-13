'use client'
import { Card, Grid, GridItem, Text, Skeleton } from '@chakra-ui/react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import Link from 'next/link'
import TableCard from '@/components/TableCard'
import PageLayout from '@/components/PageLayout'
import PageTransition from '@/components/PageTransition'

/**
 * ResourcePage — Info card at top + relation table cards below
 * @param {Array} breadcrumbs
 * @param {string} clubName
 * @param {ReactNode} actions
 * @param {string} title
 * @param {string} subtitle
 * @param {boolean} loading
 * @param {Array} fields - [{label, value}] for the info grid
 * @param {Array} relatedCards - TableCard props arrays
 */
export default function ResourcePage({
  breadcrumbs = [],
  clubName,
  actions,
  title,
  subtitle,
  loading,
  fields = [],
  relatedCards = [],
  imageUrl,
  imagePadding = 10,
}) {
  return (
    <PageLayout breadcrumbs={breadcrumbs} actions={actions} clubName={clubName}>
      <PageTransition>
        <div className="resource-page">
          {/* Main info card (+ optional image card) */}
          <Grid
            templateColumns={{ base: '1fr', md: imageUrl ? '1fr 3fr' : '1fr' }}
            gap={imageUrl ? 5 : 0}
            mb={5}
            alignItems="stretch"
          >
            {imageUrl && (
              <GridItem>
                <Card.Root className="app-card" overflow="hidden" h="100%">
                  <img
                    src={imageUrl}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      padding: imagePadding,
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </Card.Root>
              </GridItem>
            )}
            <GridItem>
              <Card.Root className="app-card" h="100%">
                <Card.Header>
                  <Card.Title className="card-title" fontSize="1.3rem">
                    {loading ? (
                      <Skeleton height="6" width="200px" style={{ background: 'rgba(255,255,255,0.15)' }} />
                    ) : (
                      title
                    )}
                  </Card.Title>
                  {subtitle && (
                    <Card.Description className="card-description">
                      {loading ? (
                        <Skeleton height="4" width="120px" mt={1} style={{ background: 'rgba(255,255,255,0.1)' }} />
                      ) : (
                        subtitle
                      )}
                    </Card.Description>
                  )}
                </Card.Header>
                <Card.Body pt={0} mt={5}>
                  {loading ? (
                    <div
                      className="info-grid"
                      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                      <div className="loader"></div>
                    </div>
                  ) : (
                    <div className="info-grid">
                      {fields.map((field, i) => (
                        <div key={i} className="info-item">
                          <label>{field.label}</label>
                          {field.href ? (
                            <p>
                              <Link
                                href={field.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  textDecoration: 'underline',
                                  color: 'inherit',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                }}
                              >
                                {field.value ?? '—'}
                                <FaExternalLinkAlt style={{ fontSize: '0.7em', opacity: 0.8 }} />
                              </Link>
                            </p>
                          ) : (
                            <p>{field.value ?? '—'}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card.Root>
            </GridItem>
          </Grid>

          {/* Related table cards */}
          {relatedCards.length > 0 && (
            <div className="cards-grid">
              {relatedCards.map((card, i) => (
                <TableCard
                  key={i}
                  title={card.title}
                  description={card.description}
                  headers={card.headers}
                  data={card.data}
                  loading={card.loading}
                  onRowClick={card.onRowClick}
                  badge={card.badge}
                  sortBy={card.sortBy}
                  sortDirection={card.sortDirection}
                  handleSort={card.handleSort}
                  maxH={card.maxH ?? '260px'}
                  width={card.width ?? 'small'}
                />
              ))}
            </div>
          )}
        </div>
      </PageTransition>
    </PageLayout>
  )
}
