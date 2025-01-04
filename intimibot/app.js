const API_URL = "https://api.openai.com/v1/completions";
const API_KEY = "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"; // אל תכניס API Key ישירות בקוד דפדפן

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
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt: question,
                max_tokens: 100
            })
        });

        const data = await response.json();
        responseDiv.textContent = data.choices[0].text.trim();
    } catch (error) {
        responseDiv.textContent = "שגיאה: לא ניתן לקבל תשובה.";
        console.error(error);
    }
});
