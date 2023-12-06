import React, { useState, useEffect } from "react";
import logo from "./santa-vs-grinch.jpeg";
import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  // Card,
  Flex,
  Text,
  TextField,
  TextAreaField
} from "@aws-amplify/ui-react";
import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";

import { generateClient } from "aws-amplify/api";
const client = generateClient();

const App = ({ signOut }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await client.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    setNotes(notesFromAPI);
  }

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = {
      name: form.get("name"),
      description: form.get("description"),
    };
    await client.graphql({
      query: createNoteMutation,
      variables: { input: data },
    });
    fetchNotes();
    event.target.reset();
  }

  async function deleteNote({ id }) {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    await client.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }


  return (

    <View className="App" >

      <Button onClick={signOut} id="sign-out">Sign Out</Button>
      <div id="home-bg">
<Heading level={1} id="home-title" > Welcome <br />  to  <br /> The Swole Pole! </Heading>
      </div>

      <Image src={logo} className="App-logo snow" alt="logo" id="main-logo" />


      <div id="b-notes">
      <Heading level={1} id="b-notes-header">The Polls Factory</Heading>

      <Text id="factory-text"> Welcome to the factory, this is how we get all our Christmas ideas every year, from you!</Text>
      <br/>
      <Text id="factory-text"> Now we can't do what everyone wants each year so we've setup a way to vote on it.</Text>

<View as="form" margin="3rem 0" onSubmit={createNote}>

    <TextField
      name="name"
      placeholder="Poll Name"
      label="Poll Name"
      labelHidden
      variation="quiet"
      required
      id="poll-name"
    />
<br />
    <TextAreaField
      name="description"
      placeholder="Poll Description: You only get 100 words, make em count :D"
      label="Poll Description"
      labelHidden
      variation="quiet"
      required
      id="poll-desc"
      rows={3}
      maxLength={100}
    />

    <Button type="submit" variation="primary" id="note-btn">
      Submit Poll
    </Button>

</View>
</div>

<div id="c-notes-body">
<Heading level={2} id="c-notes-header">Current Notes</Heading>
<View margin="3rem 0">
  {notes.map((note) => (
    <Flex
      key={note.id || note.name}
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Text as="strong" fontWeight={700} id="factory-text">
        {note.name}
      </Text>
      <Text as="span" id="factory-text">{note.description}</Text>
      <Button variation="link" onClick={() => deleteNote(note)}>
        Delete note
      </Button>
    </Flex>
  ))}
</View>
</div>
    </View>
  );
};


export default withAuthenticator(App, {signUpAttributes: ['email']});
