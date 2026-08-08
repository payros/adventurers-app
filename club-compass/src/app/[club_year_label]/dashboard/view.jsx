'use client'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import useChildren from '@/hooks/useChildren'
import useEvents from '@/hooks/useEvents'
import useStaff from '@/hooks/useStaff'
import useClasses from '@/hooks/useClasses'
import useAwards from '@/hooks/useAwards'
import DashboardPage from '@/components/pages/DashboardPage'

const View = ({
  children: initialChildren = null,
  events: initialEvents = null,
  staff: initialStaff = null,
  classes: initialClasses = null,
  awards: initialAwards = null,
  clubYear = null,
}) => {
  const clubYearLabel = useParams()['club_year_label']
  const router = useRouter()

  const [sortBy, setSortBy] = useState({
    children: { by: null, direction: 'asc' },
    events: { by: null, direction: 'asc' },
  })

  const { children, loading: loadingChildren } = useChildren(clubYear, sortBy.children, initialChildren)
  const { events, loadingEvents } = useEvents(clubYearLabel, sortBy.events, initialEvents)
  const { staff, loading: loadingStaff } = useStaff(clubYearLabel, initialStaff)
  const { classes, loading: loadingClasses } = useClasses(clubYearLabel, initialClasses)
  const { awards, loading: loadingAwards } = useAwards(clubYearLabel, initialAwards)

  function handleSorting(by, tableKey) {
    setSortBy((prev) => {
      const newDirection = prev[tableKey]?.by === by && prev[tableKey]?.direction === 'asc' ? 'desc' : 'asc'
      return { ...prev, [tableKey]: { by, direction: newDirection } }
    })
  }

  const actions = [
    {
      label: 'View Directories',
      href: `/directories`,
    },
  ]

  const cards = [
    {
      title: 'Adventurers',
      description: `${children.length} registered for ${clubYearLabel}`,
      href: `/${clubYearLabel}/adventurers`,
      hrefLabel: `View all ${clubYearLabel} adventurers`,
      action: {
        label: 'Enroll Family',
        href: `/${clubYearLabel}/families/enroll`,
      },
      headers: [
        { key: 'profileImageUrl', label: '', sortable: false, type: 'avatar' },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'age', label: 'Age', sortable: true },
        { key: 'class', label: 'Class', sortable: true },
      ],
      data: children,
      loading: loadingChildren,
      sortBy: sortBy.children.by,
      sortDirection: sortBy.children.direction,
      icon: 'FaChild',
      colorScheme: 'adventurers',
      handleSort: (by) => handleSorting(by, 'children'),
      onRowClick: (item) => router.push(`/${clubYearLabel}/adventurers/${item.id}`),
    },
    {
      title: 'Events',
      description: `${events.length} scheduled for ${clubYearLabel}`,
      href: `/${clubYearLabel}/events`,
      hrefLabel: `View all ${clubYearLabel} events`,
      action: {
        label: 'Add Event',
        href: `/${clubYearLabel}/events/new`,
      },
      headers: [
        { key: 'title', label: 'Title', sortable: true },
        { key: 'eventDate', label: 'Date', sortable: true },
      ],
      data: events,
      loading: loadingEvents,
      sortBy: sortBy.events.by,
      sortDirection: sortBy.events.direction,
      colorScheme: 'events',
      icon: 'FaCalendarAlt',
      handleSort: (by) => handleSorting(by, 'events'),
      onRowClick: (item) => router.push(`/${clubYearLabel}/events/${item.id}`),
    },
    {
      title: 'Staff',
      description: `${staff.length} helping in ${clubYearLabel}`,
      href: `/${clubYearLabel}/staff`,
      hrefLabel: `View all ${clubYearLabel} staff`,
      action: {
        label: 'Enroll Staff',
        href: `/${clubYearLabel}/staff/enroll`,
      },
      icon: 'FaUsers',
      headers: [
        { key: 'name', label: 'Name', sortable: false },
        { key: 'role', label: 'Role', sortable: false },
      ],
      data: staff,
      loading: loadingStaff,
      colorScheme: 'staff',
      onRowClick: (item) => router.push(`/${clubYearLabel}/staff/${item.id}`),
    },
    {
      title: 'Classes',
      description: `Classes instructors in ${clubYearLabel}`,
      href: `/${clubYearLabel}/classes`,
      hrefLabel: `View all ${clubYearLabel} classes`,
      action: {
        label: 'Update Instructors',
        href: `/${clubYearLabel}/classes/new`,
      },
      headers: [
        { key: 'imageUrl', label: '', sortable: false, type: 'image' },
        { key: 'class', label: 'Class', sortable: false },
        { key: 'instructor', label: 'Instructor', sortable: false },
      ],
      colorScheme: 'classes',
      icon: 'FaGraduationCap',
      data: classes,
      loading: loadingClasses,
      onRowClick: (item) => router.push(`/${clubYearLabel}/classes/${item.slug}`),
    },

    {
      title: 'Awards',
      description: `${awards.length} offered in ${clubYearLabel}`,
      href: `/${clubYearLabel}/awards`,
      badge: awards?.length ?? 0,
      hrefLabel: `View all ${clubYearLabel} awards`,
      headers: [
        { key: 'patchImageUrl', label: '', sortable: false, type: 'image' },
        { key: 'name', label: 'Name', sortable: false },
        { key: 'level', label: 'Level', sortable: false },
      ],
      data: awards,
      width: 'medium',
      colorScheme: 'awards',
      icon: 'FaAward',
      loading: loadingAwards,
      onRowClick: (item) => router.push(`/${clubYearLabel}/awards/${item.id}`),
    },
  ]

  return <DashboardPage actions={actions} cards={cards} />
}

export default View
