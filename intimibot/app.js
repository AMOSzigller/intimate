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
