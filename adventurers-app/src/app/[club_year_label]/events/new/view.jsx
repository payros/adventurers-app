"use client"
import {
  Button,
  Field,
  Fieldset,
  Input,
  AbsoluteCenter,
  Card,
  Switch,
} from "@chakra-ui/react"
import { useParams } from "next/navigation";



const View = () => {
  
  const clubYearLabel = useParams()['club_year_label']

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());


    fetch(`/api/club-years/${clubYearLabel}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  return (
    <AbsoluteCenter>
          <Card.Root maxW="sm">
    <Card.Header>
      <Card.Title>Add a Event</Card.Title>
      <Card.Description>
        Fill the information below to create a new Event.
      </Card.Description>
    </Card.Header>
    <Card.Body>
    <form onSubmit={handleSubmit}>
    <Fieldset.Root size="lg" maxW="md">
      <Fieldset.Content>
        <Field.Root>
          <Field.Label>Event Name</Field.Label>
          <Input name="title" placeholder={"Enter the name of your event"}/>
        </Field.Root>
       
        <Field.Root>
          <Field.Label>Event Date</Field.Label>
          <Input name="event_date" type="date" />
        </Field.Root>

        <Field.Root >
          <Field.Label>Is Award Ceremony?</Field.Label>
          <Switch.Root  name="award_ceremony" defaultChecked={false}>
          <Switch.HiddenInput />
          <Switch.Control />
          </Switch.Root>
        </Field.Root>


      </Fieldset.Content>

      <Button type="submit" alignSelf="flex-start" mt="4">
        Submit
      </Button>
    </Fieldset.Root>
    </form>
    </Card.Body>
  </Card.Root>
  </AbsoluteCenter>
  )
}

export default View;