const API_URL = "https://intimate-1.onrender.com/api/chat";

const questionInput = document.getElementById('question');
const responseDiv = document.getElementById('response');
const askButton = document.getElementById('askBtn');

// פונקציה לשליחת שאלה
async function sendQuestion() {
    const question = questionInput.value.trim();

    if (!question) {
        responseDiv.textContent = "אנא כתוב שאלה!";
        return;
    }

    responseDiv.textContent = "חושב על תשובה...";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: question }),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        // הצגת התשובה מהשרת
        if (data.message) {
            responseDiv.textContent = data.message;
        } else {
            responseDiv.textContent = "שגיאה: לא התקבלה תשובה.";
        }

        // איפוס שדה הטקסט
        questionInput.value = "";
    } catch (error) {
        responseDiv.textContent = `שגיאה: ${error.message || "לא ניתן לקבל תשובה."}`;
        console.error(error);
    }
}

// מאזין לחיצה על הכפתור
askButton.addEventListener('click', sendQuestion);

// מאזין לחיצה על אנטר
questionInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendQuestion();
    }
});
