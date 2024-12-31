
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const submissions = [];
.
app.post('/submit', (req, res) => {
    const { name, numbers, strongNumber } = req.body;

    if (!name || !Array.isArray(numbers) || numbers.length !== 6 || !strongNumber) {
        return res.status(400).json({ message: 'Invalid submission data.' });
    }

    const newSubmission = {
        id: uuidv4(),
        name,
        numbers,
        strongNumber,
        timestamp: new Date(),
    };

    submissions.push(newSubmission);
    console.log('New submission:', newSubmission);

    res.status(201).json({ message: 'Submission received.', submission: newSubmission });
});

app.get('/submissions', (req, res) => {
    res.json(submissions);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
