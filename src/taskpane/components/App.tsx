import React, { useState, useEffect } from "react";
import { DefaultButton, MessageBar, MessageBarType, ProgressIndicator, TextField } from "@fluentui/react";
import Center from "./Center";
import Container from "./Container";
import Login from "./Login";
import axios from "axios";
/* global OneNote console */

export default function App() {
  const [apiKey, setApiKey] = React.useState<string>("");
  const [prompt, setPrompt] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [generatedText, setGeneratedText] = React.useState<string>("");

  const $api = axios.create({
    baseURL:
    "http://localhost:5000"
  });
  
  const mainApi = {
    getText({ prompt }) {
      return $api.post<any>("prompt", {
        prompt,
      });
    },
    // getToken({ apiKey }) {
    //   return $api.post<any>("apiKey", {
    //     apiKey,
    //   });
    // },
  };

  // const mainApi = {
  //   getText({ prompt }) {
  //       try {
  //           return $api.post<any>("prompt", {
  //               prompt,
  //           });
  //       } catch (error) {
  //           console.error(error);
  //       }
  //   },
  // };

  React.useEffect(() => {
    const key = localStorage.getItem("apiKey");
    if (key) {
      setApiKey(key);
    }
  }, []);

  // const client = React.useMemo(() => {
  //   const gigaChat = new GigaChat(apiKey, true, true, true);
  //   return gigaChat;
  // }, [apiKey]);
  // client.createToken();

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem("apiKey", key);
    setError("");
  };
  // mainApi.getToken(apiKey);

  const onClick = async () => {
    setGeneratedText("");
    setLoading(true);
    try {
      const response = await mainApi.getText({ prompt });
      setGeneratedText(response.data.prompt);
    } 
      catch (e) {
      setError(error);
      setApiKey("");
    };
    setLoading(false);
  };

  // // Remove onInsert and onCopy functions as they are not defined
  // try {
  //   await OneNote.run(async (context) => {

  //       // Get the current page.
  //       const page = context.application.getActivePage();

  //       // Queue a command to set the page title.
  //       page.title = "Hello World";

  //       // Queue a command to add an outline to the page.
  //       const html = "<p><ol><li>Item #1</li><li>Item #2</li></ol></p>";
  //       page.addOutline(40, 90, html);


  const onInsert = async () => {
    await OneNote.run(async (context) => {
      const page = context.application.getActivePage();
      const pageContents = page.contents;
      context.load(pageContents);
      await context.sync();
      if (pageContents.items.length != 0 && pageContents.items[0].type == "Outline")
        {
            const outline = pageContents.items[0].outline;
            outline.appendRichText(generatedText);
            await context.sync();
        }
    });
  };

  const onCopy = async () => {
    navigator.clipboard.writeText(generatedText);
  };
  return (
    <Container>
      {apiKey ? (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
            <div style={{ marginRight: "10px" }}>
              <h3>GigaNote</h3>
            </div>
            <img src="https://i.imgur.com/9PrBQy3.png" alt="icon-16" />
          </div>
          <TextField
            placeholder="Спросите меня о чём-нибудь"
            value={prompt}
            rows={5}
            multiline={true}
            onChange={(_, newValue: string) => setPrompt(newValue || "")}
            //styles={{ fieldGroup: { borderRadius: "20px" } }}
          ></TextField>
          <Center
            style={{
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <DefaultButton
              onClick={onClick}
              styles={{ root: { borderRadius: "20px", backgroundColor: "#0088cc", color: "white" } }}
            >
              Сгенерировать
            </DefaultButton>
          </Center>
          {loading && <ProgressIndicator label="Генерирую ответ..." />}
          {generatedText && (
            <div>
              <p
                style={{
                  textAlign: "justify",
                }}
              >
                {generatedText}
              </p>
              <Center>
                <DefaultButton
                  iconProps={{ iconName: "Add" }}
                  onClick={onInsert}
                  styles={{ root: { borderRadius: "20px" } }}
                >
                  Вставить
                </DefaultButton>
                <DefaultButton
                  iconProps={{ iconName: "Copy" }}
                  onClick={onCopy}
                  styles={{ root: { borderRadius: "20px" } }}
                >
                  Копировать
                </DefaultButton>
              </Center>
            </div>
          )}
        </>
      ) : (
        <Login onSave={saveApiKey} />
      )}
      {error && <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>}
    </Container>
  );
}

// import * as React from "react";
// import Header from "./Header";
// import HeroList, { HeroListItem } from "./HeroList";
// import TextInsertion from "./TextInsertion";
// import { makeStyles } from "@fluentui/react-components";
// import { Ribbon24Regular, LockOpen24Regular, DesignIdeas24Regular } from "@fluentui/react-icons";

// interface AppProps {
//   title: string;
// }

// const useStyles = makeStyles({
//   root: {
//     minHeight: "100vh",
//   },
// });

// const App = (props: AppProps) => {
//   const styles = useStyles();
//   // The list items are static and won't change at runtime,
//   // so this should be an ordinary const, not a part of state.
//   const listItems: HeroListItem[] = [
//     {
//       icon: <Ribbon24Regular />,
//       primaryText: "Achieve more with Office integration",
//     },
//     {
//       icon: <LockOpen24Regular />,
//       primaryText: "Unlock features and functionality",
//     },
//     {
//       icon: <DesignIdeas24Regular />,
//       primaryText: "Create and visualize like a pro",
//     },
//   ];

//   return (
//     <div className={styles.root}>
//       <Header logo="assets/logo-filled.png" title={props.title} message="Welcome" />
//       <HeroList message="Discover what this add-in can do for you today!" items={listItems} />
//       <TextInsertion />
//     </div>
//   );
// };

// export default App;
