import * as React from "react";
import { DefaultButton, TextField } from "@fluentui/react";
import Center from "./Center";

interface LoginProps {
  onSave: (token: string) => void;
}
export default function Login({ onSave }: LoginProps) {
  const [token, setToken] = React.useState<string>("");

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
        <div style={{ marginRight: "5px" }}>
          <h3>Хотите задать вопрос? Авторизуйтесь</h3>
        </div>
        <img src="https://i.imgur.com/9PrBQy3.png" alt="icon-16" />
      </div>
      <TextField
        style={{
          width: "100%",
          display: "flex",
        }}
        //styles={{ fieldGroup: { borderRadius: "20px" } }}
        value={token}
        onChange={(_, newValue: string) => setToken(newValue || "")}
        placeholder={"Введите Client Secret key сюда"}
      />
      <Center
        style={{
          marginTop: "10px",
        }}
      >
        <DefaultButton
          onClick={() => onSave(token)}
          styles={{ root: { borderRadius: "20px", backgroundColor: "#0088cc", color: "white" } }}
        >
          Сохранить Client key
        </DefaultButton>
        <DefaultButton
          href="https://developers.sber.ru/studio/workspaces/my-space/get/gigachat-api"
          target="_blank"
          styles={{ root: { borderRadius: "20px", backgroundColor: "#0088cc", color: "white", marginLeft: "10px" } }}
        >
          Авторизоваться
        </DefaultButton>
      </Center>
    </>
  );
}

// import * as React from "react";
// import { useState } from "react";
// import { Button, Field, Textarea, tokens, makeStyles } from "@fluentui/react-components";
// import insertText from "../office-document";

// const useStyles = makeStyles({
//   instructions: {
//     fontWeight: tokens.fontWeightSemibold,
//     marginTop: "20px",
//     marginBottom: "10px",
//   },
//   textPromptAndInsertion: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//   },
//   textAreaField: {
//     marginLeft: "20px",
//     marginTop: "30px",
//     marginBottom: "20px",
//     marginRight: "20px",
//     maxWidth: "50%",
//   },
// });

// const TextInsertion: React.FC = () => {
//   const [text, setText] = useState<string>("Some text.");

//   const handleTextInsertion = async () => {

//     await insertText(text);
//   };

//   const handleTextChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setText(event.target.value);
//   };

//   const styles = useStyles();

//   return (
//     <div className={styles.textPromptAndInsertion}>
//       <Field className={styles.textAreaField} size="large" label="Enter text to be inserted into the document.">
//         <Textarea size="large" value={text} onChange={handleTextChange} />
//       </Field>
//       <Field className={styles.instructions}>Click the button to insert text.</Field>
//       <Button appearance="primary" disabled={false} size="large" onClick={handleTextInsertion}>
//         Insert text
//       </Button>
//     </div>
//   );
// };

// export default TextInsertion;
