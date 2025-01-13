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

    // לוגיקה להתאמת התשובה למושגים שהוגדרו
    const lowerCasePrompt = prompt.toLowerCase();
    let responseMessage = null;

    if (lowerCasePrompt.includes('gg')) {
      responseMessage = terms.gg;
    } else if (lowerCasePrompt.includes('unlucky')) {
      responseMessage = terms.unlucky;
    } else if (lowerCasePrompt.includes('standard')) {
      responseMessage = terms.standard;
    } else if (lowerCasePrompt.includes('obviously')) {
      responseMessage = terms.obviously;
    } else if (lowerCasePrompt.includes('yes')) {
      responseMessage = terms.yes;
    } else if (lowerCasePrompt.includes('no')) {
      responseMessage = terms.no;
    } else if (lowerCasePrompt.includes('gl')) {
      responseMessage = terms.gl;
    } else if (lowerCasePrompt.includes('annoying')) {
      responseMessage = terms.annoying;
    }

    // אם אין תשובה מתאימה, שליחת הודעת ברירת מחדל
    if (!responseMessage) {
      responseMessage = defaultMessage;
    }

    res.json({ message: responseMessage });
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
