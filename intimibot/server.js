const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

// הגדרת OpenAI API Key ממשתני סביבה
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Middleware
app.use(bodyParser.json());
app.use(cors());

// נתיב לטיפול בבקשות ל-OpenAI
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).send({ error: 'Prompt is required' });
    }

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 100,
    });

    res.json(response.data.choices[0].text.trim());
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error communicating with OpenAI API' });
  }
});

// הפעלת השרת
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
