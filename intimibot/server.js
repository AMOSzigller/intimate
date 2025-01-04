const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

// יצירת אפליקציית Express
const app = express();
const port = process.env.PORT || 3000;

// הגדרת OpenAI API Key ממשתני סביבה
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // ודא שהמפתח מוגדר ב-Render
});
const openai = new OpenAIApi(configuration);

// Middleware
app.use(bodyParser.json());
app.use(cors());

// נתיב ראשי
app.get('/', (req, res) => {
  res.send('Welcome to Yunger AI Bot Proxy!');
});

// נתיב לטיפול בבקשות POST ל-/api/chat
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    // בדיקה אם שדה ה-prompt קיים
    if (!prompt) {
      return res.status(400).send({ error: 'Prompt is required' });
    }

    // שליחת הבקשה ל-OpenAI API עם המודל gpt-3.5-turbo
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an AI assistant.' },
        { role: 'user', content: prompt },
      ],
    });

    // החזרת הטקסט בלבד (content) למשתמש
    res.json({ message: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error communicating with OpenAI API:', error.response ? error.response.data : error.message);

    // טיפול בשגיאות והחזרת הודעה מפורטת
    res.status(500).send({
      error: error.response ? error.response.data : 'Unknown error occurred',
    });
  }
});

// הפעלת השרת
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
