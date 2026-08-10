'use client'
import { Stack, Checkbox, Box, Heading } from '@chakra-ui/react'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { fromSnakeCaseToTitleCase } from '@/utils/stringUtils'
import { ADVENTURER_CLASSES } from '@/utils/consts'
import useChildren from '@/hooks/useChildren'
import FormPage from '@/components/pages/FormPage'

const View = ({ event: serverEvent, clubYear }) => {
  const router = useRouter()
  const clubYearLabel = useParams()['club_year_label']
  const eventId = useParams()['event_id']
  const { children, loading: loadingChildren } = useChildren(clubYear, {
    by: null,
    direction: 'asc',
  })
  const [eventData, setEventData] = useState(serverEvent ?? null)
  const [loadingEvent, setLoadingEvent] = useState(!serverEvent)
  const [selectedChildren, setSelectedChildren] = useState(
    serverEvent ? (serverEvent.children ?? []).map((child) => child.id) : []
  )
  const [submitting, setSubmitting] = useState(false)
  const [globalError, setGlobalError] = useState(null)

  useEffect(() => {
    if (serverEvent) return
    setLoadingEvent(true)
    fetch(`/api/club-years/${clubYearLabel}/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        setEventData(data)
        setSelectedChildren(data.children.map((child) => child.id) || [])
        setLoadingEvent(false)
      })
  }, [clubYearLabel, eventId])

  async function handleSubmit(event) {
    event.preventDefault()
    setGlobalError(null)
    setSubmitting(true)

    try {
      const response = await fetch(`/api/club-years/${clubYearLabel}/events/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          children: selectedChildren,
        }),
      })

      if (!response.ok) {
        const result = await response.json().catch(() => null)
        const message = result?.error ?? 'Roll call could not be submitted. Please try again.'
        console.error('Roll call PATCH failed:', message)
        setGlobalError(message)
        setSubmitting(false)
        return
      }

      router.push(`/${clubYearLabel}/events/${eventId}`)
    } catch (error) {
      console.error('Roll call submission error:', error)
      setGlobalError('Roll call could not be submitted. Please try again.')
      setSubmitting(false)
    }
  }

  function handleCheckboxChange(childId, isChecked) {
    setSelectedChildren((prev) => (isChecked ? [...prev, childId] : prev.filter((id) => id !== childId)))
  }

  const classes = children
    .reduce((acc, child) => {
      if (!acc.includes(child.classSlug)) {
        acc.push(child.classSlug)
      }
      return acc
    }, [])
    .sort((a, b) => (ADVENTURER_CLASSES[a]?.order ?? 99) - (ADVENTURER_CLASSES[b]?.order ?? 99))

  const breadcrumbs = [
    { label: 'Events', href: `/${clubYearLabel}/events` },
    { label: eventData?.title ?? 'Event', href: `/${clubYearLabel}/events/${eventId}` },
    { label: 'Roll Call' },
  ]

  return (
    <FormPage
      title={`Roll Call for ${eventData?.title ?? 'Event'}`}
      description="Select all the children who attended this event. Awards will be distributed based on attendance."
      breadcrumbs={breadcrumbs}
      clubName={`${clubYearLabel} Club`}
      globalError={globalError}
      handleSubmit={handleSubmit}
      submitLabel="Submit Roll Call"
      submitLoadingLabel="Submitting…"
      loading={submitting}
      contentLoading={loadingEvent || loadingChildren}
    >
      <Stack direction="column" gap="2">
        {classes.map((classSlug) => (
          <Box key={classSlug} p="2">
            <Heading fontWeight="bold" size="md">
              {fromSnakeCaseToTitleCase(classSlug)}
            </Heading>
            <Stack direction="column" gap="1" mt="2">
              {children
                .filter((child) => child.classSlug === classSlug)
                .map((child) => (
                  <Checkbox.Root
                    key={child.id}
                    checked={selectedChildren.includes(child.id)}
                    onCheckedChange={(e) => handleCheckboxChange(child.id, !!e.checked)}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>{child.name}</Checkbox.Label>
                  </Checkbox.Root>
                ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </FormPage>
  )
}

export default View
