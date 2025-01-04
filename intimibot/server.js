const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

// יצירת אפליקציית Express
const app = express();
const port = process.env.PORT || 3000;

// הגדרת OpenAI API Key ממשתני סביבה
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // ודא שהמפתח מוגדר ב-Render כמשתנה סביבה
});
const openai = new OpenAIApi(configuration);

// Middleware
app.use(bodyParser.json());
app.use(cors());

// נתיב ראשי להצגת הודעה פשוטה
app.get('/', (req, res) => {
  res.send('Welcome to Yunger AI Bot Proxy!');
});

// נתיב לטיפול בבקשות POST ל-/api/chat
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body; // קבלת ה-prompt מהבקשה

    if (!prompt) {
      return res.status(400).send({ error: 'Prompt is required' });
    }

    // שליחת הבקשה ל-OpenAI API
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 100,
    });

    // שליחת התשובה בחזרה
    res.json(response.data.choices[0].text.trim());
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error communicating with OpenAI API' });
  }
});

// טיפול בבקשות GET ל-/api/chat
app.get('/api/chat', (req, res) => {
  res.status(405).send('This endpoint only supports POST requests.');
});

// הפעלת השרת
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
