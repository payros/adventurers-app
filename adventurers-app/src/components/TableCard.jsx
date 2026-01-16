import { TableCell,
      Card,
  Table, 
  Skeleton,
  Button,
  Spacer,
  Icon
 } from "@chakra-ui/react";
   
import { FaCaretDown, FaCaretUp } from "react-icons/fa";


function TableCard({ title, headers, data, loading, sortBy, sortDirection, handleSort }) {
  return (
    <Card.Root maxW="sm">
    <Card.Header>
      <Card.Title>{title}</Card.Title>
    </Card.Header>
    <Card.Body>
          <Table.ScrollArea borderWidth="1px" rounded="md" height="260px">
          <Table.Root size="sm" stickyHeader>
      <Table.Header>
        <Table.Row bg="gray.100" >
            {
                headers.map((header) => (
                    <Table.ColumnHeader key={header.key} onClick={() => header.sortable ? handleSort(header.key) : null}>
                      {header.sortable ? (
                        <Button size="sm" variant="plain">
                          {header.label}
                          <Spacer />
                          { sortBy === header.key ? (
                            <Icon size="xs">
                              { sortDirection === 'asc' ? <FaCaretUp /> : <FaCaretDown />}
                            </Icon>
                          ) : null}
                        </Button>
                      ) : (
                        header.label
                      )}
                    </Table.ColumnHeader>
                ))
            }
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {loading ? (<><Table.Row>
            <Table.Cell colSpan={4}><Skeleton height="5" /></Table.Cell>

          </Table.Row><Table.Row>
            <Table.Cell colSpan={4}><Skeleton height="5" /></Table.Cell>

          </Table.Row><Table.Row>
            <Table.Cell colSpan={4}><Skeleton height="5" /></Table.Cell>

          </Table.Row></>)
         : data.map((item, index) => (
          <Table.Row key={index}>
            {headers.map((header) => <TableCell key={header.key}>{item[header.key]}</TableCell>)}
          </Table.Row>
        )) }
      </Table.Body>
    </Table.Root>
    </Table.ScrollArea>
    </Card.Body>
    </Card.Root>
  )
}

export default TableCard;