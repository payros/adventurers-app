"use client"
import {
  Button,
  Field,
  Fieldset,
  Input,
  AbsoluteCenter,
  Card,
} from "@chakra-ui/react"



const View = () => {

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    fetch('/api/club-years', {
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
      <Card.Title>Add a Club Year</Card.Title>
      <Card.Description>
        Fill the information below to create a new club year.
      </Card.Description>
    </Card.Header>
    <Card.Body>
    <form onSubmit={handleSubmit}>
    <Fieldset.Root size="lg" maxW="md">
      <Fieldset.Content>
        <Field.Root>
          <Field.Label>Club Name</Field.Label>
          <Input name="clubName" placeholder={"Enter the official name of your club"}/>
        </Field.Root>
       <Field.Root>
          <Field.Label>Year Label</Field.Label>
          <Input name="label" placeholder={"Enter a URL-friendly label for this year."}/>
        </Field.Root>

        <Field.Root>
          <Field.Label>Start Date</Field.Label>
          <Input name="startDate" type="date" />
        </Field.Root>

        <Field.Root>
           <Field.Label>End Date</Field.Label>
          <Input name="endDate" type="date" />
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