import React, { useState, useEffect } from "react";
import { DefaultButton, MessageBar, MessageBarType, ProgressIndicator, TextField } from "@fluentui/react";
import Center from "./Center";
import Container from "./Container";
import Login from "./Login";
import axios from "axios";
// const dotenv = require("dotenv").config({ path: './../../../.env' });
/* global OneNote console */

export default function App() {
  const [apiKey, setApiKey] = React.useState<string>("");
  const [prompt, setPrompt] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [generatedText, setGeneratedText] = React.useState<string>("");
  // const URL_BACK = `${process.env.BACK}`

  const $api = axios.create({
    baseURL:
    "http://localhost:5000"
  });
  

  const mainApi = {
    getText({ prompt }) {
      return $api.post<any>("prompt", {
        prompt
      });
    },
    getToken({ apiKey }) {
      return $api.post<any>("api", {
        apiKey,
      });
    },
  };

  React.useEffect(() => {
    const key = localStorage.getItem("apiKey");
    if (key) {
      setApiKey(key);
    }
  }, []);


  const saveApiKey = (key) => {
    const existingKey = localStorage.getItem('apiKey');
    console.log(existingKey);
    setApiKey(key);
    localStorage.setItem('apiKey', key);
    if (!existingKey || existingKey !== key) {
      mainApi.getToken({ apiKey: key }).then(() => {
        setError("");
      }).catch((e) => {
        console.error(e);
        setApiKey("");
        localStorage.removeItem("apiKey");
        setError("Не удалось получить токен из API, попробуйте снова");
      });
    } else {
      setApiKey(key);
      localStorage.setItem("apiKey", key);
      setError("");
      mainApi.getToken({ apiKey: key });
    }
  };


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


  const onInsert = async () => {
    Office.context.document.getSelectedDataAsync(
      Office.CoercionType.Text,
      function (asyncResult) {
        const error = asyncResult.error;
        if (asyncResult.status === Office.AsyncResultStatus.Failed) {
          console.log(error.message);
        } else {
          Office.context.document.setSelectedDataAsync(generatedText, { coercionType: Office.CoercionType.Text }, function (asyncResult) {
            const error = asyncResult.error;
            if (asyncResult.status === Office.AsyncResultStatus.Failed) {
              console.log(error.message);
            }
          });
        };
      }
    )
  };


  const copyToClipboard = (text) => {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
  
    const selected =
      document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false;
    
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
  };
  
  const onCopy = () => {
    copyToClipboard(generatedText);
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
