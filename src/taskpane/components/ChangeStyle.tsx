import React, { useState, useEffect } from "react";
import { DefaultButton, MessageBar, MessageBarType, ProgressIndicator, TextField } from "@fluentui/react";
import Center from "./Center";
import Container from "./Container";
import Login from "./Login";
import axios from "axios";
// const dotenv = require("dotenv").config({ path: './../../../.env' });
/* global OneNote console */


export default function ChangeStyle() {
  const [apiKey, setApiKey] = React.useState<string>("");
  const [prompt, setPrompt] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  // const URL_BACK = `${process.env.BACK}`

  const $api = axios.create({
    baseURL:
    "http://localhost:5000"
  });
  

  const mainApi = {
    getToken({ apiKey }) {
      return $api.post<any>("api", {
        apiKey,
      });
    },
    getStyle({ prompt, style }) {
      return $api.post<any>("menu/style", {
        prompt, style
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

const onChangeStyle = async () => {
    setLoading(true);
    Office.context.document.getSelectedDataAsync(
      Office.CoercionType.Text,
      function (asyncResult) {
        if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
          const text = asyncResult.value;
          mainApi
            .getStyle({ prompt: text, style: prompt })
            .then((response) => {
              Office.context.document.setSelectedDataAsync(response.data.prompt, {
                coercionType: Office.CoercionType.Text,
              });
            })
            .catch((e) => {
              console.error(e);
              setApiKey("");
            })
            .finally(() => {
              setLoading(false);
            });
        } else {
          console.error(asyncResult.error);
          setLoading(false);
        }
      }
    );
  };

return (
    <Container>
      {apiKey ? (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
            <div style={{ marginRight: "10px" }}>
              <h3>Изменить стиль текста</h3>
            </div>
            <img src="https://i.imgur.com/9PrBQy3.png" alt="icon-16" />
          </div>
          <TextField
            placeholder="Укажите стиль текста"
            value={prompt}
            rows={3}
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
                onClick={onChangeStyle}
                styles={{ root: { borderRadius: "20px", backgroundColor: "#0088cc", color: "white", marginRight: "10px" } }}
            >
                Изменить стиль
            </DefaultButton>
          </Center>
          {loading && <ProgressIndicator label="Генерирую ответ..." />}
        </>
      ) : (
        <Login onSave={saveApiKey} />
      )}
      {error && <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>}
    </Container>
  );
}
