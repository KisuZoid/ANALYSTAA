let prompt = document.querySelector("#prompt");
let submitbtn = document.querySelector("#submit");
let chatContainer = document.querySelector(".chat-container");
let imagebtn = document.querySelector("#image");
let image = document.querySelector("#image img");
let imageinput = document.querySelector("#image input");

const stockApiBaseUrl = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=";
const apiKey = "NX1Q19992HB7BWP1";
const geminiApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDklUevts2JsybXkeRpG5x4RgIW0sHThC4";

let user = {
    message: null,
    file: {
        mime_type: null,
        data: null
    }
};
async function getStockPrices(symbols) {
    let stockPrices = [];
    for (let symbol of symbols) {
        try {
            let response = await fetch(`${stockApiBaseUrl}${symbol}&apikey=${apiKey}`);
            let data = await response.json();
            if (data["Global Quote"] && data["Global Quote"]["05. price"]) {
                stockPrices.push(`${symbol}: $${data["Global Quote"]["05. price"]}`);
            } else {
                stockPrices.push(`${symbol}: Unavailable`);
            }
        } catch (error) {
            console.error("Stock API Error:", error);
            stockPrices.push(`${symbol}: Error fetching data`);
        }
    }
    return stockPrices.join(", ");
}
async function getChatResponse(userMessage) {
    try {
        let response = await fetch(geminiApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userMessage }] }]
            })
        });

        let data = await response.json();
        if (data && data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            return "I couldn't generate a response.";
        }
    } catch (error) {
        console.error("Chat API Error:", error);
        return "I'm having trouble responding right now.";
    }
}
async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area");
    let userMessage = user.message.toLowerCase();
    
    if (userMessage.includes("stock") || userMessage.includes("price")) {
        let stockSymbols = userMessage.match(/\b[A-Z]{1,5}\b/g) || ["IBM", "AAPL", "TSLA"];
        let stockPrices = await getStockPrices(stockSymbols);
        text.innerHTML = `Stock Prices: ${stockPrices}`;
    } else {
        let chatResponse = await getChatResponse(userMessage);
        text.innerHTML = chatResponse;
    }
}
function createChatBox(html, classes) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}
function handlechatResponse(userMessage) {
    if (!userMessage.trim()) return;
    
    user.message = userMessage;
    let html = `<img src="user.png" alt="" id="userImage" width="8%">
<div class="user-chat-area">
${user.message}
${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
</div>`;
    prompt.value = "";
    let userChatBox = createChatBox(html, "user-chat-box");
    chatContainer.appendChild(userChatBox);
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

    setTimeout(() => {
        let html = `<img src="ai.png" alt="" id="aiImage" width="10%">
        <div class="ai-chat-area">
        <img src="loading.webp" alt="" class="load" width="50px">
        </div>`;
        let aiChatBox = createChatBox(html, "ai-chat-box");
        chatContainer.appendChild(aiChatBox);
        generateResponse(aiChatBox);
    }, 600);
}


prompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handlechatResponse(prompt.value);
    }
});

submitbtn.addEventListener("click", () => {
    handlechatResponse(prompt.value);
});

imageinput.addEventListener("change", () => {
    const file = imageinput.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = (e) => {
        let base64string = e.target.result.split(",")[1];
        user.file = {
            mime_type: file.type,
            data: base64string
        };
        image.src = `data:${user.file.mime_type};base64,${user.file.data}`;
        image.classList.add("choose");
    };
    reader.readAsDataURL(file);
});

imagebtn.addEventListener("click", () => {
    imageinput.click();
});
