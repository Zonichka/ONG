import App from "./components/App";
import { AppContainer } from "react-hot-loader";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { ThemeProvider } from "@fluentui/react";
import * as React from "react";
import * as ReactDOM from "react-dom";
/* global Office, module, require */

initializeIcons();

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <ThemeProvider>
        <Component />
      </ThemeProvider>
    </AppContainer>,
    // eslint-disable-next-line no-undef
    document.getElementById("container")
  );
};

Office.onReady(() => {
  render(App);
});

if ((module as any).hot) {
  (module as any).hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    render(NextApp);
  });
}

// import * as React from "react";
// import { createRoot } from "react-dom/client";
// import App from "./components/App";
// import { FluentProvider, webLightTheme } from "@fluentui/react-components";

// /* global document, Office, module, require */

// const title = "Contoso Task Pane Add-in";

// const rootElement: HTMLElement = document.getElementById("container");
// const root = createRoot(rootElement);

// /* Render application after Office initializes */
// Office.onReady(() => {
//   root.render(
//     <FluentProvider theme={webLightTheme}>
//       <App title={title} />
//     </FluentProvider>
//   );
// });

// if ((module as any).hot) {
//   (module as any).hot.accept("./components/App", () => {
//     const NextApp = require("./components/App").default;
//     root.render(NextApp);
//   });
// }
