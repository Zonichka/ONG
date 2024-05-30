import { AppContainer } from "react-hot-loader";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { ThemeProvider } from "@fluentui/react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import ChangeStyle from "./components/ChangeStyle";
/* global Office, module, require */

initializeIcons();

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <ThemeProvider>
        <Component />
      </ThemeProvider>
    </AppContainer>,
    document.getElementById("changeStyle")
  );
};

Office.onReady(() => {
  render(ChangeStyle);
});

if ((module as any).hot) {
  (module as any).hot.accept("./components/ChangeStyle", () => {
    const NextChangeStyle = require("./components/ChangeStyle").default;
    render(NextChangeStyle);
  });
}
