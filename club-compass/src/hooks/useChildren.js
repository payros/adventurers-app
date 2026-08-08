import { useEffect, useState } from 'react'
import { fromSnakeCaseToTitleCase } from '@/utils/stringUtils'
import { fromDateOfBirthToAge } from '@/utils/dateUtils'
import { filterByProps } from '@/utils/arrayUtils'

export function transformChild(c, clubYear = null) {
  const base = {
    id: c.id,
    name: `${c.firstName} ${c.lastName}`,
    age: c.dateOfBirth ? fromDateOfBirthToAge(c.dateOfBirth, clubYear?.endDate) : '—',
    profileImageUrl: c.profileImageUrl || '/img/profile_placeholder.png',
    sex: c.sex === 'male' ? 'M' : c.sex === 'female' ? 'F' : '—',
    allergies: c.allergies ?? '—',
    medicalConditions: c.medicalConditions ?? '—',
    parents: c.parents ?? '—',
  }
  if (clubYear?.label) {
    base.class = fromSnakeCaseToTitleCase(c.class)
    base.grade = c.grade ? fromSnakeCaseToTitleCase(c.grade) : '—'
    base.attendance = c.attendance != null ? `${c.attendance}%` : '—'
    base.awardsEarned = c.awardsEarned ?? 0
  }
  return base
}

function transform(raw, clubYear) {
  return raw.map((c) => transformChild(c, clubYear))
}

function sortChildren(childrenList, by, direction) {
  if (!by) return childrenList
  const orderDirection = direction === 'asc' ? 1 : -1
  return [...childrenList].sort((a, b) => {
    switch (by) {
      case 'name':
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase()) * orderDirection
      case 'age':
        return (a.age - b.age) * orderDirection
      case 'class':
        return a.class.toLowerCase().localeCompare(b.class.toLowerCase()) * orderDirection
      case 'grade':
        return a.grade.toLowerCase().localeCompare(b.grade.toLowerCase()) * orderDirection
      default:
        return 0
    }
  })
}

function useChildren(clubYear = null, { by, direction, filter } = {}, initialData = null) {
  const clubYearLabel = clubYear?.label ?? null
  const [rawChildren, setRawChildren] = useState(initialData ?? [])
  const [children, setChildren] = useState(() => {
    if (!initialData) return []
    let list = transform(initialData, clubYear)
    list = sortChildren(list, by, direction)
    return filterByProps(list, ['name'], filter)
  })
  const [loading, setLoading] = useState(initialData === null)

  useEffect(() => {
    if (initialData !== null) return
    setLoading(true)
    const url = clubYearLabel ? `/api/club-years/${clubYearLabel}/children` : '/api/children'
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setRawChildren(data)
        let childrenList = transform(data, clubYear)
        childrenList = sortChildren(childrenList, by, direction)
        childrenList = filterByProps(childrenList, ['name'], filter)
        setChildren(childrenList)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [clubYearLabel])

  // Re-sort/re-transform/re-filter whenever sort, endDate, or filter changes
  useEffect(() => {
    if (rawChildren.length === 0) return
    let childrenList = transform(rawChildren, clubYear)
    childrenList = sortChildren(childrenList, by, direction)
    childrenList = filterByProps(childrenList, ['name'], filter)
    setChildren(childrenList)
  }, [by, direction, clubYear?.endDate, filter])

  return { children, loading }
}

export default useChildren
