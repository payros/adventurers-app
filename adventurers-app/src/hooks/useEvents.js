import { useEffect, useState } from "react"
import { fromDateToString } from "@/utils/dateUtils";

function useEvents(clubYearLabel,{by, direction}) {
  const [rawEvents, setRawEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  function transformEventsData(rawEvents) {
    return rawEvents.map((event) => ({ ...event, eventDate: fromDateToString(event.eventDate) }));
  }

  function sortEvents(eventsList) {
    if (by) {
      let order = 0;
      const orderDirection = direction === 'asc' ? 1 : -1;
      const sortedEvents = [...eventsList].sort((a, b) => {
        switch(by) {
          case 'title':
            const nameA = a.title.toLowerCase();
            const nameB = b.title.toLowerCase();
            order = nameA.localeCompare(nameB);
            break;
          case 'eventDate':
            order = new Date(a.eventDate) - new Date(b.eventDate);
            break;
          default:
            order = 0;
        }
        return order * orderDirection;
      });
      return sortedEvents
    }

    return eventsList;
  }

  // Fetch events data from the API
  useEffect(() => {
    setLoadingEvents(true);
    fetch(`/api/club-years/${clubYearLabel}/events`)
      .then(res => res.json())
      .then(data => {
        setRawEvents(data);
        setLoadingEvents(false);
      })
  }, [clubYearLabel])

  // Transform and sort events whenever rawEvents, sortBy, or sortDirection change
  useEffect(() => {
    let eventsList = transformEventsData(rawEvents);
    eventsList = sortEvents(eventsList);
    setEvents(eventsList);
  }, [by, direction, rawEvents]);

  return { events, loadingEvents };
}

export default useEvents;