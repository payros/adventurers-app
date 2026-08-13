import { TableCell, Card, Table, Button, Spacer, Icon, Text, Input } from '@chakra-ui/react'
import { FaCaretDown, FaCaretUp, FaExternalLinkAlt, FaArrowRight } from 'react-icons/fa'
import * as FaIcons from 'react-icons/fa'
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
  hrefLabel,
  action,
  handleSearch,
  searchPlaceholder = 'Search...',
  maxH = '320px',
  width = 'small',
  hideHeaders = false,
  colorScheme = null,
  icon = null,
}) {
  const widthStyle =
    width === 'full' || width === 'large'
      ? { width: '100%', flexShrink: 0 }
      : width === 'medium'
        ? { flex: '2 1 0', minWidth: 'min(max(450px, calc(66.67% - 0.42rem)), 100%)' }
        : { flex: '1 1 0', minWidth: 'min(max(340px, calc(33.33% - 0.84rem)), 100%)' }
  const accentColor = colorScheme ? `var(--color-${colorScheme})` : null
  const FaIcon = icon ? FaIcons[icon] : null
  return (
    <Card.Root
      className="app-card table-card"
      style={{
        ...widthStyle,
        ...(accentColor ? { borderTop: `3px solid ${accentColor}` } : {}),
      }}
    >
      <Card.Header pb={2}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {FaIcon && (
              <Icon
                style={{
                  color: accentColor ?? 'var(--color-text-secondary)',
                  fontSize: '2.4rem',
                  flexShrink: 0,
                }}
              >
                <FaIcon />
              </Icon>
            )}
            <div>
              <Card.Title className="card-title">{title}</Card.Title>
              {description ? (
                <Card.Description className="card-description">{description}</Card.Description>
              ) : (
                <div style={{ height: '1.25em' }} />
              )}
            </div>
          </div>
          {action && (
            <Button
              asChild
              size="sm"
              variant="outline"
              style={accentColor ? { borderColor: accentColor, color: accentColor } : undefined}
            >
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
      <Card.Body pt={0} mt={3} pb={3}>
        <Table.ScrollArea lob className="scroll-area" height={maxH}>
          <Table.Root size="sm" stickyHeader className="table">
            {!hideHeaders && (
              <Table.Header className="table-header">
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
            )}
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
                    style={{
                      background: index % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.03)',
                      border: 'none',
                    }}
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
      <Card.Footer pt={0} mt={0} pb={3}>
        {href && (
          <Link
            href={href}
            style={{ textDecoration: 'none', color: accentColor ?? 'inherit', display: 'block', width: '100%' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {hrefLabel ?? 'View All'}
              <Icon
                size="sm"
                style={{
                  transition: 'opacity 0.15s',
                  marginTop: '2px',
                }}
              >
                <FaArrowRight />
              </Icon>
            </span>
          </Link>
        )}
      </Card.Footer>
    </Card.Root>
  )
}

export default TableCard
