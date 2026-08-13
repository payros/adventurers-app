'use client'
import React, { useState } from 'react'
import { Breadcrumb, Button, MenuRoot, MenuTrigger, MenuPositioner, MenuContent, MenuItem } from '@chakra-ui/react'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { FaChevronRight, FaChevronDown } from 'react-icons/fa'
import useClubYears from '@/hooks/useClubYears'

function loadClubYearOptions(currentClubYearLabel, clubYears) {
  if (!currentClubYearLabel || clubYears.length === 0) return []
  const sortedYears = [...clubYears].sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
  const currentIndex = sortedYears.findIndex((y) => y.label === currentClubYearLabel)
  if (currentIndex === 0) {
    // Most recent year selected: show up to 5 years back
    return sortedYears.slice(1, 6)
  } else if (currentIndex > 0) {
    // Not the most recent: show 1 immediately forward + up to 4 back
    const forwardYear = sortedYears[currentIndex - 1]
    const backYears = sortedYears.slice(currentIndex + 1, currentIndex + 5)
    return [forwardYear, ...backYears]
  }
  return []
}

/**
 * Breadcrumbs component
 * @param {Array} items - [{label, href}] — last item is current (no href needed)
 */
export default function Breadcrumbs({ items = [] }) {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const currentClubYearLabel = params?.club_year_label ?? null
  const { clubYears } = useClubYears()

  const dropdownYears = loadClubYearOptions(currentClubYearLabel, clubYears)
  const [yearMenuOpen, setYearMenuOpen] = useState(false)

  function handleSelectYear(yearLabel) {
    const newPath = pathname.replace(`/${currentClubYearLabel}/`, `/${yearLabel}/`)
    router.push(newPath)
  }

  return (
    <Breadcrumb.Root className="breadcrumbs" size="lg" mt={0} style={{ overflow: 'hidden' }}>
      <Breadcrumb.List style={{ flexWrap: 'nowrap', overflow: 'hidden' }}>
        {currentClubYearLabel ? (
          <>
            <Breadcrumb.Item>
              {dropdownYears.length > 0 ? (
                <MenuRoot
                  positioning={{ placement: 'bottom-start' }}
                  open={yearMenuOpen}
                  onOpenChange={(details) => setYearMenuOpen(details.open)}
                  onSelect={(details) => handleSelectYear(details.value)}
                >
                  <MenuTrigger asChild>
                    <Button className="breadcrumb-year-trigger" style={{ height: '24px' }}>
                      {currentClubYearLabel}
                      {yearMenuOpen ? (
                        <FaChevronDown style={{ fontSize: '1.2rem' }} />
                      ) : (
                        <FaChevronRight style={{ fontSize: '1.2rem' }} />
                      )}
                    </Button>
                  </MenuTrigger>
                  <MenuPositioner>
                    <MenuContent>
                      {dropdownYears.map((year) => (
                        <MenuItem key={year.label} value={year.label} cursor="pointer">
                          {year.label}
                        </MenuItem>
                      ))}
                    </MenuContent>
                  </MenuPositioner>
                </MenuRoot>
              ) : (
                <Breadcrumb.CurrentLink style={{ color: '#1c3450', fontWeight: 600, fontSize: '2rem' }}>
                  {currentClubYearLabel}
                </Breadcrumb.CurrentLink>
              )}
            </Breadcrumb.Item>
            {dropdownYears.length === 0 && (
              <Breadcrumb.Separator
                hideBelow={items.length > 0 ? 'md' : undefined}
                style={{ color: '#1c3450' }}
                ml={2}
                mr={1}
              >
                <FaChevronRight style={{ fontSize: '1.2rem' }} />
              </Breadcrumb.Separator>
            )}
            <Breadcrumb.Item hideBelow={items.length > 0 ? 'lg' : undefined}>
              <Breadcrumb.Link asChild>
                <Link href={`/${currentClubYearLabel}/dashboard`} style={{ color: '#1c3450' }}>
                  Dashboard
                </Link>
              </Breadcrumb.Link>
            </Breadcrumb.Item>
          </>
        ) : (
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <Link href="/directories" style={{ color: '#1c3450' }}>
                Directories
              </Link>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        )}
        {items.length > 0 && (
          <Breadcrumb.Separator
            hideBelow={dropdownYears.length > 0 ? 'lg' : undefined}
            style={{ color: '#1c3450' }}
            ml={2}
            mr={1}
          >
            <FaChevronRight style={{ fontSize: '1.2rem' }} />
          </Breadcrumb.Separator>
        )}
        {items.map((item, i) => {
          const isLast = i === items.length - 1

          return (
            <React.Fragment key={i}>
              <Breadcrumb.Item hideBelow={!isLast ? 'md' : undefined}>
                {isLast ? (
                  <Breadcrumb.CurrentLink style={{ color: '#1c3450', fontWeight: 600 }}>
                    {item.label}
                  </Breadcrumb.CurrentLink>
                ) : (
                  <Breadcrumb.Link asChild>
                    <Link href={item.href ?? '#'} style={{ color: '#1c3450' }}>
                      {item.label}
                    </Link>
                  </Breadcrumb.Link>
                )}
              </Breadcrumb.Item>
              {!isLast && (
                <Breadcrumb.Separator hideBelow="md" style={{ color: '#1c3450' }} ml={2} mr={1}>
                  <FaChevronRight style={{ fontSize: '1.2rem' }} />
                </Breadcrumb.Separator>
              )}
            </React.Fragment>
          )
        })}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  )
}
