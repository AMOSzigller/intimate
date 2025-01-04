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
        if (data.error) {
            responseDiv.textContent = `Error from API: ${data.error.message}`;
        } else {
            responseDiv.textContent = data;
        }
    } catch (error) {
        responseDiv.textContent = `שגיאה: ${error.message || "לא ניתן לקבל תשובה."}`;
        console.error(error);
    }
});
