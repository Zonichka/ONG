const https = require('https');
const uuid = require('uuid').v4;
const axios = require('axios').default;

class controller {
  httpsAgent = new https.Agent({
    rejectUnauthorized: false
  });

  async getText(req, res) {
    try {
      const { prompt } = req.body;

      const textAI = await axios.post(
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
            Authorization: `Bearer ${this.authorization}`,
          },
          httpsAgent: this.httpsAgent,
        }
      );
      const response = textAI.data;
      console.log(JSON.stringify(response));
      res.status(200).json({ prompt: response.choices[0].message.content });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error processing request" });
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

      const response = await axios.post(
        "https://ngw.devices.sberbank.ru:9443/api/v2/oauth",
        encodeURI("scope=GIGACHAT_API_PERS"),
        {
          headers,
          httpsAgent: this.httpsAgent,
        }
      );
      this.authorization = response.data.access_token;
      console.log(this.authorization);
      res.status(200).json({ access_token: this.authorization });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error obtaining access token" });
    }
  }
}

module.exports = new controller();