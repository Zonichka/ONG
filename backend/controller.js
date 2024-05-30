const GigaChat = require('gigachat-node').GigaChat;

class controller {
  constructor() {
    this.apiKey = null;
    this.client = null;
    this.MAKE_EASY_PROMPT = `Ты - система, которая упрощает текст.
    Ты должна улучшить читабельность и понятность текста.
    Если не можешь изменить текст, ты должна вернуть тот же текст.
    Вот текст: `;
    this.FINISH_PROMPT = `Ты система продолжения текста. Система продолжения текста работает следующим образом: когда ей 
    предоставляется начальный текст, она анализирует его стилистику и контекст, а затем генерирует 
    продолжение текста в том же стиле и с учетом данного контекста. Ответ системы всегда содержит только 
    продолжение текста, без дополнительных комментариев или информации. \nПродолжи текст: `;
    this.FIX_PROMPT = `Ты система исправления ошибок в тексте.
    Ты умеешь только исправить текст, ничего больше. 
    Если не можешь найти ошибки, ты должна вернуть тот же текст.
    Не добавляй знак " в начале и в конце текста, если их не было.
    Исправь грамматические и пунктуационные ошибки, в тексте: `;
    this.MAIN_THEMES_PROMPT = `Ты - система выявление основных идей текста.
    Когда тебе приходит текст, ты находишь главные идеи текста.
    В своем ответе ты пишешь только идеи, которые нашла. Больше ничего.
    Какие основные идеи в тексте: `;
    this.EXPLANATIONS_PROMPT = `Ты - система, которая объясняет текст и термины в нем.
    Пиши только объяснения текста. Ничего больше.
    Вот текст:  `;
    this.TO_OPTIONS_OF_CONTENT_PROMPT = `Ты - система подбора оглавления.
    Тебе приходит текст и ты подбираешь 3 наиболее подходящих вариантов оглавления к тексту
    Вот текст:   `;
    this.CHANGE_STYLE_PROMPT = `Ты - система, которая пишет текст только в стиле: {style}.
    Когда тебе приходит текст, ты пытаешься переписать его в этом стиле.
    Если не можешь поменять стиль текста, ты должна вернуть тот же текст.
    Перепиши текст в стиле {style}: `;
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
      console.log(this.apiKey);
      const client = this.getOrCreateClient();
      console.log(client);
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
      console.log(client);
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