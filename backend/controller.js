const https = require('https');
const dotenv = require("dotenv").config();
const uuid = require('uuid').v4;
const axios = require('axios').default;

class controller {
  // constructor() {
  //   this.authorization = null;
  // }

  async getText(req, res) {
    try {
      const { prompt } = req.body;

      const httpsAgent = new https.Agent({
        rejectUnauthorized: false
      });

      const textAI = await axios
        .post(
          "https://gigachat.devices.sberbank.ru/api/v1/chat/completions",
          JSON.stringify({
            model: "GigaChat:latest",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            max_tokens: 512,
            temperature: 0.7,
            stream: false,
            profanity_check: true,
          }),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.AUTH}`,
            },
            httpsAgent: httpsAgent,
          },
        )
        .then((response) => {
            console.log(JSON.stringify(response.data));
            return response.data.choices[0].message.content;
        })
        .catch((error) => {
            console.log(error);
            return error;
        });

      res.status(200).json({ prompt: textAI });
    } catch (e) {
      res.status(400).json({ message: "Сервер не отвечает, попробуйте еще раз" });
    }
  }
  async getToken(req, res) {
    try {
      const { apiKey } = req.body;

      const headers = {
        Authorization: `Basic ${apiKey}`,
        RqUID: uuid(),
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      };

      const httpsAgent = new https.Agent({
        rejectUnauthorized: false
      });

      const access_token = await axios
      .post(
        "https://ngw.devices.sberbank.ru:9443/api/v2/oauth",
        encodeURI("scope=GIGACHAT_API_PERS"),
        {
          headers: headers,
          httpsAgent: httpsAgent,
        },
      )
      .then((response) => {
          process.env.AUTH = response.data.access_token;
          console.log(process.env.AUTH);
          return response.data.access_token;
      })
      .catch((error) => {
          console.log(error);
          return error;
      });
      res.status(200).json({ access_token: access_token });
    } catch (e) {
      res.status(400).json({ message: "Сервер не отвечает, попробуйте еще раз" });
    }
  }
}

module.exports = new controller();