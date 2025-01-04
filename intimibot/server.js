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

    // שליחת הבקשה ל-OpenAI API
    const response = await openai.createCompletion({
      model: 'text-davinci-003', // ודא שהמודל נגיש עבורך
      prompt: prompt,
      max_tokens: 100,
    });

    // החזרת התשובה למשתמש
    res.json({ response: response.data.choices[0].text.trim() });
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
