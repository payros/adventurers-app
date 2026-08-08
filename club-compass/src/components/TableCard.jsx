import { useState } from 'react'
import { TableCell, Card, Table, Skeleton, Button, Spacer, Icon, Text, Input } from '@chakra-ui/react'
import { FaCaretDown, FaCaretUp, FaExternalLinkAlt, FaArrowRight } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Link from 'next/link'

const MotionRow = motion.create(Table.Row)

function TableCard({
  title,
  description,
  headers,
  data,
  loading,
  sortBy,
  sortDirection,
  handleSort,
  onRowClick,
  href,
  action,
  handleSearch,
  searchPlaceholder = 'Search...',
  maxH = '320px',
  width = 'small',
}) {
  const widthStyle =
    width === 'full' || width === 'large'
      ? { width: '100%', flexShrink: 0 }
      : width === 'medium'
        ? { flex: '2 1 0', minWidth: 'min(max(450px, calc(66.67% - 0.42rem)), 100%)' }
        : { flex: '1 1 0', minWidth: 'min(max(340px, calc(33.33% - 0.84rem)), 100%)' }
  const [titleHovered, setTitleHovered] = useState(false)
  return (
    <Card.Root className="glass-card" style={widthStyle}>
      <Card.Header pb={2}>
        <div className={`card-header-inner${width === 'small' ? ' card-header-inner--stacked' : ''}`}>
          <div style={{ flex: '1 1 auto' }}>
            {href ? (
              <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
                <span
                  onMouseEnter={() => setTitleHovered(true)}
                  onMouseLeave={() => setTitleHovered(false)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Card.Title className="card-title">{title}</Card.Title>
                  <Icon
                    size="sm"
                    style={{
                      opacity: titleHovered ? 1 : 0,
                      transition: 'opacity 0.15s',
                      marginTop: '2px',
                      color: 'var(--text-dark)',
                    }}
                  >
                    <FaArrowRight />
                  </Icon>
                </span>
              </Link>
            ) : (
              <Card.Title className="card-title">{title}</Card.Title>
            )}
            {description ? (
              <Card.Description className="card-description">{description}</Card.Description>
            ) : (
              <div style={{ height: '1.25em' }} />
            )}
          </div>
          {action && (
            <Button asChild size="md" variant="outline" colorPalette="brand">
              <Link href={action.href}>{action.label}</Link>
            </Button>
          )}
          {handleSearch && (
            <div className="card-header-search">
              <Input size="sm" placeholder={searchPlaceholder} onChange={(e) => handleSearch(e.target.value)} />
            </div>
          )}
        </div>
      </Card.Header>
      <Card.Body pt={0} mt={3}>
        <Table.ScrollArea lob className="glass-scrollarea" height={maxH}>
          <Table.Root size="sm" stickyHeader className="glass-table">
            <Table.Header className="glass-table-header">
              <Table.Row bg="transparent">
                {headers.map((header) => (
                  <Table.ColumnHeader
                    key={header.key}
                    onClick={() => (header.sortable && handleSort ? handleSort(header.key) : null)}
                    style={{
                      cursor: header.sortable ? 'pointer' : 'default',
                      minWidth: header.type === 'image' || header.type === 'avatar' ? '3rem' : undefined,
                    }}
                  >
                    {header.sortable ? (
                      <Button size="sm" variant="plain">
                        {header.label}
                        <Spacer />
                        {sortBy === header.key ? (
                          <Icon size="xs">{sortDirection === 'asc' ? <FaCaretUp /> : <FaCaretDown />}</Icon>
                        ) : null}
                      </Button>
                    ) : (
                      <Text>{header.label}</Text>
                    )}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {loading || !data ? (
                <Table.Row bg="transparent" style={{ borderColor: 'transparent' }}>
                  <Table.Cell
                    colSpan={headers.length}
                    style={{
                      textAlign: 'center',
                      height: `calc(${maxH} - 2.5rem)`,
                      verticalAlign: 'middle',
                    }}
                  >
                    <div className="loader"></div>
                  </Table.Cell>
                </Table.Row>
              ) : data.length === 0 ? (
                <Table.Row bg="transparent" style={{ borderColor: 'transparent' }}>
                  <Table.Cell
                    colSpan={headers.length}
                    style={{
                      textAlign: 'center',
                      height: `calc(${maxH} - 2.5rem)`,
                      verticalAlign: 'middle',
                    }}
                  >
                    <Text textAlign="center" py={4} fontSize="md">
                      No records found
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ) : (
                data.map((item, index) => (
                  <MotionRow
                    key={`${item.id ?? ''}-${index}`}
                    bg="transparent"
                    className={onRowClick ? 'clickable-row' : ''}
                    onClick={() => onRowClick && onRowClick(item)}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.18 }}
                  >
                    {headers.map((header) => (
                      <TableCell key={header.key} color="rgba(255,255,255,0.9)" fontSize="sm">
                        {header.type === 'image' && item[header.key] && (
                          <img
                            src={item[header.key]}
                            alt=""
                            style={{
                              height: '2rem',
                              width: 'auto',
                              objectFit: 'contain',
                              display: 'block',
                              margin: '0 auto',
                            }}
                          />
                        )}
                        {header.type === 'avatar' && item[header.key] && (
                          <img
                            src={item[header.key]}
                            alt=""
                            style={{
                              height: '1.8rem',
                              width: '1.8rem',
                              objectFit: 'cover',
                              borderRadius: '9999px',
                              display: 'block',
                              margin: '0 auto',
                            }}
                          />
                        )}
                        {header.type === 'link' && item[header.hrefKey] && (
                          <Link
                            href={item[header.hrefKey]}
                            onClick={(e) => e.stopPropagation()}
                            target={header.hrefExternal ? '_blank' : undefined}
                            rel={header.hrefExternal ? 'noopener noreferrer' : undefined}
                            style={{
                              textDecoration: 'underline',
                              color: 'inherit',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            {item[header.key]}
                            {header.hrefExternal && <FaExternalLinkAlt style={{ fontSize: '0.7em', opacity: 0.8 }} />}
                          </Link>
                        )}
                        {!header.type && item[header.key]}
                      </TableCell>
                    ))}
                  </MotionRow>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Card.Body>
    </Card.Root>
  )
}

export default TableCard
