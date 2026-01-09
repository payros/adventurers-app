"use client"
import {
  AbsoluteCenter,
  Card,
  Table, 
  Skeleton
} from "@chakra-ui/react"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"
import { fromSnakeCaseToTitleCase } from "@/utils/stringUtils";

// Colocar cartão e tabela com informações do clube

const View = () => {
  const clubYearLabel = useParams()['club_year_label'];
  const [children, setChildren] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(true);

  useEffect(() => {
    // Fetch children data from the API
    setLoadingChildren(true);
    fetch(`/api/club-years/${clubYearLabel}/children`)
      .then(res => res.json())
      .then(data => {
        setChildren(data);
        setLoadingChildren(false);
      })
  }, [clubYearLabel])


    return (
    <AbsoluteCenter>
                  <Card.Root maxW="sm">
    <Card.Header>
      <Card.Title>Adventurers</Card.Title>
    </Card.Header>
    <Card.Body>
          <Table.Root size="sm">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>First Name</Table.ColumnHeader>
          <Table.ColumnHeader>Last Name</Table.ColumnHeader>
          <Table.ColumnHeader>Class</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {loadingChildren ? (<><Table.Row>
            <Table.Cell colSpan={4}><Skeleton height="5" /></Table.Cell>

          </Table.Row><Table.Row>
            <Table.Cell colSpan={4}><Skeleton height="5" /></Table.Cell>

          </Table.Row><Table.Row>
            <Table.Cell colSpan={4}><Skeleton height="5" /></Table.Cell>

          </Table.Row></>)
         : children.map((child) => (
          <Table.Row key={child.id}>
            <Table.Cell>{child.firstName}</Table.Cell>
            <Table.Cell>{child.lastName}</Table.Cell>
            <Table.Cell>{fromSnakeCaseToTitleCase(child.class)}</Table.Cell>
          </Table.Row>
        )) }
      </Table.Body>
    </Table.Root>
      </Card.Body>
      </Card.Root>
     </AbsoluteCenter>
  )
}

export default View;