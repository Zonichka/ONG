const GigaChat = require('gigachat-node').GigaChat;
const dotenv = require("dotenv").config();

class controller {
  constructor() {
    this.apiKey = null;
    this.client = null;
    this.MAKE_EASY_PROMPT = dotenv.parsed.MAKE_EASY_PROMPT;
    this.FINISH_PROMPT = dotenv.parsed.FINISH_PROMPT;
    this.FIX_PROMPT = dotenv.parsed.FIX_PROMPT;
    this.MAIN_THEMES_PROMPT = dotenv.parsed.MAIN_THEMES_PROMPT;
    this.EXPLANATIONS_PROMPT = dotenv.parsed.EXPLANATIONS_PROMPT;
    this.TO_OPTIONS_OF_CONTENT_PROMPT = dotenv.parsed.TO_OPTIONS_OF_CONTENT_PROMPT;
    this.CHANGE_STYLE_PROMPT = dotenv.parsed.CHANGE_STYLE_PROMPT;
  }

  createGigaChat(apiKey) {
    return new GigaChat(apiKey, true, true, true);
  }


  getOrCreateClient() {
    if (!this.client) {
      if (this.apiKey)  {
        this.client = this.createGigaChat(this.apiKey);
      }
    }
    return this.client;
  }


  saveApiKey(key) {
    this.apiKey = key;
  }


  async getToken(req, res) {
    try {
      const { apiKey } = req.body;
      this.saveApiKey(apiKey);
      const client = this.getOrCreateClient();
      await client.createToken();
      res.status(200).json({ access_token: client.authorization });
    } catch (error) {
      console.error(error);
      this.apiKey = null;
      this.client  = null;
      res.status(400).json({ message: "Error obtaining access token" });
    }
  }


  async getText(req, res) {
    try {
      const { prompt } = req.body;

      const client = this.getOrCreateClient();
      const response = await client.completion({
        "model": "GigaChat:latest",
        "messages": [
          {
            "role": "user",
            "content": prompt
          }
        ],
        "max_tokens": 512,
        "temperature": 0.7,
        "stream": false,
        "profanity_check": true,
      });
      res.status(200).json({ prompt: response.choices[0].message.content });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error processing request" });
    }
  }


  async processText(req, res, prompt, content, maxTokens, temperature) {
    try {
      const client = this.getOrCreateClient();
      console.log(client);
      console.log(prompt);
      console.log(content);
      console.log(maxTokens);
      console.log(temperature);
      const response = await client.completion({
        "model": "GigaChat:latest",
        "messages": [
          {
            "role": "system",
            "content": content,
          },
          {
            "role": "user",
            "content": prompt,
          }
        ],
        "max_tokens": maxTokens,
        "temperature": temperature,
        "stream": false,
        "profanity_check": true,
      });
      res.status(200).json({ prompt: response.choices[0].message.content });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error processing request" });
    }
  }

  async makeTextEasy(req, res) {
    const { prompt } = req.body;
    await this.processText(req, res, prompt, this.MAKE_EASY_PROMPT, 1024, 0.87);
  }
  
  async finishText(req, res) {
    const { prompt } = req.body;
    await this.processText(req, res, prompt, this.FINISH_PROMPT, 1024, 0.87);
  }

  async fixText(req, res) {
    const { prompt } = req.body;
    await this.processText(req, res, prompt, this.FIX_PROMPT, 1024, 0.87);
  }

  async mainThemesText(req, res) {
    const { prompt } = req.body;
    await this.processText(req, res, prompt, this.MAIN_THEMES_PROMPT, 1024, 0.87);
  }

  async explanationsText(req, res)  {
    const { prompt } = req.body;
    await this.processText(req, res, prompt, this.EXPLANATIONS_PROMPT, 1024, 0.87);
  }
  
  async toOptionsOfContentText(req, res)  {
    const { prompt } = req.body;
    await this.processText(req, res, prompt, this.TO_OPTIONS_OF_CONTENT_PROMPT, 1024, 0.87);
  }

  async changeStyleText(req, res) {
    const { prompt, style } = req.body;
    try {
      const client = this.getOrCreateClient();
      const system_prompt = this.CHANGE_STYLE_PROMPT.replace(/{style}/g, style);
      const response = await client.completion({
        "model": "GigaChat:latest",
        "messages": [
          {
            "role": "system",
            "content": system_prompt,
          },
          {
            "role": "user",
            "content": prompt,
          }
        ],
        "max_tokens": 1024,
        "temperature": 0.87,
        "stream": false,
        "profanity_check": true,
      });
      res.status(200).json({ prompt: response.choices[0].message.content });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Error processing request" });
    }
  }
}

module.exports = new controller();