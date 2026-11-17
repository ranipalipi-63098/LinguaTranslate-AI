
// Get HTML elements

const sourceLanguage = document.getElementById("sourceLanguage");
const targetLanguage = document.getElementById("targetLanguage");

const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

const translateBtn = document.getElementById("translateBtn");
const swapBtn = document.getElementById("swapBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");

const charCount = document.getElementById("charCount");
const statusMessage = document.getElementById("statusMessage");
let translationHistory = JSON.parse(
    localStorage.getItem("translationHistory")
) || [];

// Language names for speech

const languageCodes = {
    en: "en-US",
    te: "te-IN",
    hi: "hi-IN",
    ta: "ta-IN",
    kn: "kn-IN",
    ml: "ml-IN",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
    ja: "ja-JP"
};
function detectLanguage(text) {
    const teluguPattern = /[\u0C00-\u0C7F]/;
    const hindiPattern = /[\u0900-\u097F]/;
    const tamilPattern = /[\u0B80-\u0BFF]/;
    const kannadaPattern = /[\u0C80-\u0CFF]/;
    const malayalamPattern = /[\u0D00-\u0D7F]/;

    if (teluguPattern.test(text)) return "te";translateBtn.addEventListener("click", async function () {

    const text = inputText.value.trim();

    if (text === "") {
        statusMessage.textContent =
            "Please enter some text first!";
        return;
    }

    if (text.length > 500) {
        statusMessage.textContent =
            "Please enter no more than 500 characters.";
        return;
    }
let actualSourceLanguage = sourceLanguage.value;

if (actualSourceLanguage === "auto") {
    actualSourceLanguage = detectLanguage(text);
}
    if (actualSourceLanguage === targetLanguage.value) {
    statusMessage.textContent =
        "Source and target languages cannot be the same.";
    return;
}
    translateBtn.disabled = true;
    translateBtn.textContent = "Translating...";
    statusMessage.textContent = "Please wait...";

    try {

       const params  = new URLSearchParams({
            q: text,
            langpair:
    actualSourceLanguage + "|" + targetLanguage.value
        });

        const response = await fetch(
            "https://api.mymemory.translated.net/get?" +
            params.toString()
        );

        if (!response.ok) {
            throw new Error("Translation service unavailable.");
        }

        const data = await response.json();

        if (
            data.responseStatus !== 200 ||
            !data.responseData ||
            !data.responseData.translatedText
        ) {
            throw new Error(
                data.responseDetails || "Translation failed."
            );
        }

        outputText.value =
            data.responseData.translatedText;
            const historyList = document.getElementById("historyList");

if (historyList.textContent.includes("No translations yet.")) {
    historyList.innerHTML = "";
}

const historyItem = document.createElement("div");

const original = document.createElement("p");
original.textContent = "Original: " + text;

const translated = document.createElement("p");
translated.textContent = "Translation: " + data.responseData.translatedText;

historyItem.appendChild(original);
historyItem.appendChild(translated);
translationHistory.push({
    original: text,
    translated: data.responseData.translatedText,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
});

localStorage.setItem(
    "translationHistory",
    JSON.stringify(translationHistory)
);

historyList.prepend(historyItem);

        statusMessage.textContent =
            "Translation completed successfully!";

    } catch (error) {

        statusMessage.textContent =
            "Sorry! " + error.message;

    } finally {

        translateBtn.disabled = false;
        translateBtn.textContent = "Translate Now →";

    }

});


// Swap languages

swapBtn.addEventListener("click", function () {

    const oldSource = sourceLanguage.value;
    const oldText = inputText.value;

    sourceLanguage.value = targetLanguage.value;
    targetLanguage.value = oldSource;

    inputText.value = outputText.value;
    outputText.value = oldText;

    charCount.textContent =
        inputText.value.length + " characters";

   statusMessage.textContent = "Languages and text swapped successfully!";
});


// Clear text

clearBtn.addEventListener("click", function () {

    inputText.value = "";
    outputText.value = "";

    charCount.textContent = "0 characters";
    statusMessage.textContent = "";

});


// Copy translation
copyBtn.addEventListener
("click", async function () {

    if (outputText.value.trim() === "") {
        statusMessage.textContent =
            "Nothing to copy!";
        return;
    }

    try {

       
        statusMessage.textContent =
            "Translation copied successfully!";

    } catch (error) {

        statusMessage.textContent =
            "Unable to copy. Please select and copy manually.";

    }
const textToCopy = outputText.value;
await navigator.clipboard.writeText(textToCopy);
});


// Voice input

 // Voice input

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

window.startVoiceInput = function () {

    if (!SpeechRecognition) {
        statusMessage.textContent =
            "Voice input is not supported in this browser. Try Google Chrome.";
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang =
        languageCodes[sourceLanguage.value] || "en-US";

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function () {
        console.log("MICROPHONE STARTED!");
        statusMessage.textContent = "Listening... Speak now!";
    };

    recognition.onaudiostart = function () {
        console.log("AUDIO STARTED!");
    };

    recognition.onspeechstart = function () {
        console.log("SPEECH DETECTED!");
    };

    recognition.onresult = function (event) {
        inputText.value = event.results[0][0].transcript;

        charCount.textContent =
            inputText.value.length + " characters";

        statusMessage.textContent =
            "Voice captured successfully!";
    };

    recognition.onerror = function (event) {
        console.log("MICROPHONE ERROR:", event.error);
        statusMessage.textContent =
            "Voice error: " + event.error;
    };

    recognition.onend = function () {
        console.log("VOICE RECOGNITION ENDED");
    };

    try {
        recognition.start();
    } catch (error) {
        statusMessage.textContent =
            "Voice error: " + error.message;
        console.error(error);
    }

};

recognition.onaudiostart = function () {
    console.log("AUDIO STARTED!");
};

recognition.onspeechstart = function () {
    console.log("SPEECH DETECTED!");
};

recognition.onerror = function (event) {
    console.log("MICROPHONE ERROR:", event.error);
    statusMessage.textContent = "Voice error: " + event.error;
};



    recognition.onresult = function (event) {
        inputText.value =
            event.results[0][0].transcript;

        charCount.textContent =
            inputText.value.length + " characters";

        statusMessage.textContent = "Voice captured successfully!";
    };

   recognition.onerror = function (event) {
    console.log("MICROPHONE ERROR:", event.error);

    statusMessage.textContent =
        "Voice error: " + event.error;
};
    

 recognition.onend = function () {
    console.log("VOICE RECOGNITION ENDED");
};

try {
    recognition.start();
} catch (error) {
    statusMessage.textContent = "Voice error: " + error.message;
    console.error(error);
}

};



// Text-to-speech

window.speakTranslation = function () {

    const text = outputText.value.trim();

    if (!text) {
        statusMessage.textContent =
            "Translate something first!";
        return;
    }

    if (!("speechSynthesis" in window)) {
        statusMessage.textContent =
            "Speech playback is not supported.";
        return;
    }

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang =
        languageCodes[targetLanguage.value];
const availableVoices = speechSynthesis.getVoices();

const selectedVoice = availableVoices.find(function (voice) {
    return voice.lang === speech.lang;
});

if (!selectedVoice) {
    statusMessage.textContent =
        "No voice available for this language. Try English.";
    return;
}

speech.voice = selectedVoice;
window.speechSynthesis.speak(speech);
    
    statusMessage.textContent =
        "Playing translation...";

};

console.log("LinguaTranslate AI is ready!");

const clearHistoryBtn = document.getElementById("clearHistoryBtn");

clearHistoryBtn.addEventListener("click", function () {
   
    const historyList = document.getElementById("historyList");

    historyList.innerHTML =
        "<p>No translations yet. Start translating!</p>";
        translationHistory = [];

localStorage.removeItem("translationHistory");
});
const savedHistoryList = document.getElementById("historyList");

if (translationHistory.length > 0) {
    savedHistoryList.innerHTML = "";

    translationHistory.forEach(function (item) {
        const historyItem = document.createElement("div");

        const original = document.createElement("p");
        original.textContent = "Original: " + item.original;

        const translated = document.createElement("p");
        translated.textContent = "Translation: " + item.translated;

        historyItem.appendChild(original);
        historyItem.appendChild(translated);
const dateTime = document.createElement("p");

dateTime.textContent =
    "Date: " + (item.date || "Earlier") +
    " | Time: " + (item.time || "Not available");

historyItem.appendChild(dateTime);
        savedHistoryList.appendChild(historyItem);
    });
}

const downloadHistoryBtn = document.getElementById("downloadHistoryBtn");

downloadHistoryBtn.addEventListener("click", function () {

    if (translationHistory.length === 0) {
        alert("No translation history to download!");
        return;
    }

    let content = "LINGUATRANSLATE AI - TRANSLATION HISTORY\n\n";

    translationHistory.forEach(function (item, index) {
        content += "Translation " + (index + 1) + "\n";
        content += "Original: " + item.original + "\n";
        content += "Translated: " + item.translated + "\n";
        content += "Date: " + (item.date || "Earlier") + "\n";
        content += "Time: " + (item.time || "Not available") + "\n\n";
    });

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "LinguaTranslate-History.txt";
    link.click();

    URL.revokeObjectURL(url);
});
const darkModeBtn = document.getElementById("darkModeBtn");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    darkModeBtn.textContent = "☀️ Light Mode";
}

darkModeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        darkModeBtn.textContent = "☀️ Light Mode";
    } else {
        localStorage.setItem("theme", "light");
        darkModeBtn.textContent = "🌙 Dark Mode";
    }

});
darkModeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        darkModeBtn.textContent = "☀️ Light Mode";
    } else {
        darkModeBtn.textContent = "🌙 Dark Mode";
    }
});