"use client"
import {
  AbsoluteCenter,
} from "@chakra-ui/react"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"
import { fromSnakeCaseToTitleCase } from "@/utils/stringUtils"
import { fromDateOfBirthToAge } from "@/utils/dateUtils";
import TableCard from "@/components/TableCard";

// Colocar cartão e tabela com informações do clube

const View = () => {
  const childrenHeaders = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'age', label: 'Age', sortable: true },
    { key: 'class', label: 'Class', sortable: true }
  ]

  const clubYearLabel = useParams()['club_year_label'];
  const [rawChildren, setRawChildren] = useState([]);
  const [children, setChildren] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');


  function transformChildenData(rawChildren) {
    return rawChildren.map((child) => ({
      id: child.id,
      name: `${child.firstName} ${child.lastName}`,
      age: fromDateOfBirthToAge(child.dateOfBirth),
      class: fromSnakeCaseToTitleCase(child.class)
    }));
  }

  function sortChildren(childrenList) {
    if (sortBy) {
      let order = 0;
      const orderDirection = sortDirection === 'asc' ? 1 : -1;
      const sortedChildren = [...childrenList].sort((a, b) => {
        switch(sortBy) {
          case 'name':
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            order = nameA.localeCompare(nameB);
            break;
          case 'age':
            order = a.age - b.age;
            break;
          case 'class':
            const classA = a.class.toLowerCase();
            const classB = b.class.toLowerCase();
            order = classA.localeCompare(classB);
            break;
          default:
            order = 0;
        }
        return order * orderDirection;
      });
      return sortedChildren
    }

    return childrenList;
  }

  function setChildrenSorting(by) {
    if (sortBy === by) {
      // Toggle sort direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(by);
      setSortDirection('asc');
    }
  }

  useEffect(() => {
    // Fetch children data from the API
    setLoadingChildren(true);
    fetch(`/api/club-years/${clubYearLabel}/children`)
      .then(res => res.json())
      .then(data => {
        setRawChildren(data);
        setLoadingChildren(false);
      })
  }, [clubYearLabel])

  useEffect(() => {
    let childrenList = transformChildenData(rawChildren);
    childrenList = sortChildren(childrenList);
    setChildren(childrenList);
  }, [sortBy, sortDirection, rawChildren]);

    return (
    <AbsoluteCenter>
      <TableCard title="Children" sortBy={sortBy} sortDirection={sortDirection} headers={childrenHeaders} data={children} loading={loadingChildren} handleSort={(by) => setChildrenSorting(by)}></TableCard>
      <TableCard title="Class" sortBy={sortBy} sortDirection={sortDirection} headers={childrenHeaders} data={children} loading={loadingChildren} handleSort={(by) => setChildrenSorting(by)}></TableCard>
      <TableCard title="Events" sortBy={sortBy} sortDirection={sortDirection} headers={childrenHeaders} data={children} loading={loadingChildren} handleSort={(by) => setChildrenSorting(by)}></TableCard>
     </AbsoluteCenter>
  )
}

export default View;