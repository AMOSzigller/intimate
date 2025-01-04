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

        const data = await response.json();
        if (data.error) {
            responseDiv.textContent = "Error: " + data.error.message;
            return;
        }

        responseDiv.textContent = data;
    } catch (error) {
        responseDiv.textContent = "שגיאה: לא ניתן לקבל תשובה.";
        console.error(error);
    }
});
