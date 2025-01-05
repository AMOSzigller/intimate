const API_URL = "https://intimate-1.onrender.com/api/chat";

document.getElementById('askBtn').addEventListener('click', async () => {
    const question = document.getElementById('question').value;
    const responseDiv = document.getElementById('response');

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

        // הצגת תוכן ההודעה (message) בלבד
        if (data.message) {
            responseDiv.textContent = data.message;
        } else {
            responseDiv.textContent = "שגיאה: לא התקבלה תשובה.";
        }
    } catch (error) {
        responseDiv.textContent = `שגיאה: ${error.message || "לא ניתן לקבל תשובה."}`;
        console.error(error);
    }
});
