const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

// יצירת אפליקציית Express
const app = express();
const port = process.env.PORT || 3000;

// הגדרת OpenAI API Key
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // ודא שהמפתח מוגדר
});
const openai = new OpenAIApi(configuration);

// Middleware
app.use(bodyParser.json());
app.use(cors());

// נתיב ראשי
app.get('/', (req, res) => {
  res.send('Welcome to Yunger AI Bot Proxy!');
});

// רשימת המושגים המוגדרים
const terms = {
  gg: 'גג',
  unlucky: 'אנלאקי',
  standard: 'סטנדרטי',
  obviously: 'אובב',
  yes: 'כן',
  no: 'לא',
  gl: 'גלגל',
  annoying: 'כמה דם',
};

// הודעה ברירת מחדל
const defaultMessage = "אני עדיין לומד איך לענות על זה, מבטיח שאני משתפר כל הזמן, בינתיים אתה מוזמן לבדוק מה חדש באתר האינטימיים או להתקשר לאחד האינטימיים לשאול מה חדש.";

// נתיב לטיפול בבקשות POST ל-/api/chat
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    // בדיקה אם שדה ה-prompt קיים
    if (!prompt) {
      return res.status(400).send({ error: 'Prompt is required' });
    }

    // שליחת הבקשה ל-OpenAI API עם הגדרת המושגים
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant who can only respond using the following predefined terms:
          - גג (Good Game)
          - אנלאקי (Unlucky)
          - סטנדרטי (Standard)
          - אובב (Obviously)
          - כן (Yes)
          - לא (No)
          - גלגל (Good Luck)
          - כמה דם (Annoying)
          If the input does not match any of these terms, respond with the default message: "${defaultMessage}".`
        },
        { role: 'user', content: prompt },
      ],
    });

    // קבלת התשובה מה-API
    const aiResponse = response.data.choices[0].message.content.trim();

    res.json({ message: aiResponse });
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
