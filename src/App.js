import logo from "./santa-vs-grinch.jpeg";
import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
} from "@aws-amplify/ui-react";

function App({ signOut }) {
  return (
    <View className="App">
      <Card id="app">
      <Button onClick={signOut} id="sign-out">Sign Out</Button>
      <div id="home-bg">
<Heading level={1} id="home-title" > Welcome <br />  to  <br /> The Swole Pole! </Heading>
      </div>

      <Image src={logo} className="App-logo" alt="logo" id="main-logo" />

      </Card>
    </View>
  );
}

export default withAuthenticator(App);
