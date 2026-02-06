"use client"
import {
  AbsoluteCenter,
} from "@chakra-ui/react"
import { useParams } from "next/navigation";
import { useState } from "react"
import useChildren from "@/hooks/useChildren";
import useEvents from "@/hooks/useEvents";
import TableCard from "@/components/TableCard";

// Colocar cartão e tabela com informações do clube

const View = () => {
  const childrenHeaders = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'age', label: 'Age', sortable: true },
    { key: 'class', label: 'Class', sortable: true }
  ]

    const eventsHeaders = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'eventDate', label: 'Date', sortable: true },
  ]

  const clubYearLabel = useParams()['club_year_label'];
  const [sortBy, setSortBy] = useState({ 
    children: { by: null, direction: 'asc'}, 
    adventurerClass: { by: null, direction: 'asc'}, 
    events: { by: null, direction: 'asc'} 
  });
  const { children, loadingChildren } = useChildren(clubYearLabel, sortBy.children);
  const { events, loadingEvents } = useEvents(clubYearLabel, sortBy.events);

  function handleSorting(by, tableKey) {
      setSortBy(sortBy => {
        let newBy = by;
        let newDirection = 'asc';

        // Toggle sort direction
        if (sortBy[tableKey].by === by) {
          newDirection = sortBy[tableKey].direction === 'asc' ? 'desc' : 'asc';
        }

        return {
          ...sortBy,
          [tableKey]: {
            by: newBy,
            direction: newDirection
          }
        }
      });
  }


//******************
// Render the dashboard view **********
//******************


    return (
    <AbsoluteCenter>
      <TableCard title="Children" sortBy={sortBy.children.by} sortDirection={sortBy.children.direction} headers={childrenHeaders} data={children} loading={loadingChildren} handleSort={(by) => handleSorting(by, 'children')}></TableCard>
      {/* <TableCard title="Class" sortBy={sortBy.adventurerClass.by} sortDirection={sortBy.adventurerClass.direction} headers={childrenHeaders} data={children} loading={loadingChildren} handleSort={(by) => handleSorting(by, 'adventurerClass')}></TableCard> */}
      <TableCard title="Events" sortBy={sortBy.events.by} sortDirection={sortBy.events.direction} headers={eventsHeaders} data={events} loading={loadingEvents} handleSort={(by) => handleSorting(by, 'events')}></TableCard>
     </AbsoluteCenter>
  )
}

export default View;