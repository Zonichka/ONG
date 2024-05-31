/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
import axios from "axios";
// const dotenv = require("dotenv").config({ path: './../../.env' });
// const URL_BACK = `${process.env.BACK}`
// import App from "../taskpane/components/App";

/* global Office */
const $api = axios.create({
  baseURL:
  "http://localhost:5000"
});
  
const mainApi = {
  async postData(endpoint, prompt) {
    return $api.post<any>(`menu/${endpoint}`, { prompt });
  },
  getToken({ apiKey }) {
    return $api.post<any>("api", {
      apiKey,
    });
  },
};
  
const key = localStorage.getItem("apiKey");
  
Office.onReady(() => {
  // If needed, Office.js is ready to be called.
});
  
/**
 * Shows a notification when the add-in command is executed.
 * @param event
 */

async function handleAction(event: Office.AddinCommands.Event, endpointModifier) {
  Office.context.document.getSelectedDataAsync(
    Office.CoercionType.Text,
    async function (asyncResult) {
      const error = asyncResult.error;
      if (asyncResult.status === Office.AsyncResultStatus.Failed) {
        console.log(error.message);
      } else {
        const prompt = asyncResult.value;
        const response = await mainApi.postData(endpointModifier, prompt);
        if (endpointModifier === "finish") {
          Office.context.document.setSelectedDataAsync(prompt + ' ' + response.data.prompt, { coercionType: Office.CoercionType.Text });
        } if (endpointModifier === "mainthemes") {
          Office.context.document.setSelectedDataAsync(prompt + '\nГлавные темы: \n' + response.data.prompt, { coercionType: Office.CoercionType.Text });
        } if (endpointModifier === "tooptions") {
          Office.context.document.setSelectedDataAsync('Оглавление: \n' + response.data.prompt + '\n\n' + prompt, { coercionType: Office.CoercionType.Text });
        } if (endpointModifier === "explanation") {
          Office.context.document.setSelectedDataAsync(prompt + ' (' + response.data.prompt + ') ', { coercionType: Office.CoercionType.Text });
        } if (endpointModifier === "easy" || endpointModifier ===  "fix") {
          Office.context.document.setSelectedDataAsync(response.data.prompt, { coercionType: Office.CoercionType.Text });
        }
      }
      event.completed();
    });
  }
  
  async function MakeTextEasy(event: Office.AddinCommands.Event) {
    handleAction(event, "easy");
  }
  
  async function FinishText(event: Office.AddinCommands.Event) {
    handleAction(event, "finish");
  }
  
  async function FixText(event: Office.AddinCommands.Event) {
    handleAction(event, "fix");
  }

  async function MainThemesText(event: Office.AddinCommands.Event) {
    handleAction(event, "mainthemes");
  }

  async function ExplanationText(event: Office.AddinCommands.Event) {
    handleAction(event, "explanation");
  }

  async function toOptionsText(event: Office.AddinCommands.Event) {
    handleAction(event, "tooptions");
  }

function getGlobal() {
  return typeof self !== "undefined"
    ? self
    : typeof window !== "undefined"
    ? window
    : typeof global !== "undefined"
    ? global
    : undefined;
}

const g = getGlobal() as any;

// The add-in command functions need to be available in global scope
g.MakeTextEasy = MakeTextEasy;
g.FinishText = FinishText;
g.FixText = FixText;
g.MainThemesText  = MainThemesText;
g.ExplanationText  = ExplanationText;
g.toOptionsText  = toOptionsText;


// // Register the function with Office.
Office.actions.associate("MakeTextEasy", MakeTextEasy);
Office.actions.associate("FinishText", FinishText);
Office.actions.associate("FixText", FixText);
Office.actions.associate("MainThemesText", MainThemesText);
Office.actions.associate("ExplanationText", ExplanationText);
Office.actions.associate("toOptionsText", toOptionsText);

