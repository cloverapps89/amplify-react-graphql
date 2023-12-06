import React, { useState, useEffect } from "react";
import logo from "./santa-vs-grinch.jpeg";
import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
  Flex,
  Text,
  TextField
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

    <View className="App">
      <Card id="app">
      <Button onClick={signOut} id="sign-out">Sign Out</Button>
      <div id="home-bg">
<Heading level={1} id="home-title" > Welcome <br />  to  <br /> The Swole Pole! </Heading>
      </div>

      <Image src={logo} className="App-logo" alt="logo" id="main-logo" />

      </Card>
      <div id="b-notes">
      <Heading level={1}>The Poles Board</Heading>
<View as="form" margin="3rem 0" onSubmit={createNote}>
  <Flex direction="row" justifyContent="center">
    <TextField
      name="name"
      placeholder="Note Name"
      label="Note Name"
      labelHidden
      variation="quiet"
      required
      id="note-name"
    />
    <TextField
      name="description"
      placeholder="Note Description"
      label="Note Description"
      labelHidden
      variation="quiet"
      required
      id="note-desc"
    />
    <Button type="submit" variation="primary">
      Create Note
    </Button>
  </Flex>
</View>
</div>
<div id="c-notes">
<Heading level={2}>Current Notes</Heading>
<View margin="3rem 0">
  {notes.map((note) => (
    <Flex
      key={note.id || note.name}
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Text as="strong" fontWeight={700}>
        {note.name}
      </Text>
      <Text as="span">{note.description}</Text>
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
