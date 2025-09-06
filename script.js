let history = [];
let recognition;
let listening = false;

// 🎤 Speech recognition setup
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById("input").value = transcript;
    send();
  };
}

function toggleMic() {
  if (listening) {
    recognition.stop();
    listening = false;
  } else {
    recognition.start();
    listening = true;
  }
}

async function send() {
  const text = document.getElementById("input").value;
  if (!text) return;

  history.push({ role: "user", content: text });
  appendMessage("user", text);
  document.getElementById("input").value = "";

  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ history })
  });
  const data = await res.json();
  const reply = data.choices[0].message.content;
  history.push({ role: "assistant", content: reply });
  appendMessage("bot", reply);

  speak(reply);
}

function appendMessage(role, text) {
  const chat = document.getElementById("chat");
  chat.innerHTML += `<div class="msg ${role}">${role === "user" ? "You" : "Bot"}: ${text}</div>`;
  chat.scrollTop = chat.scrollHeight;
}

// 🔊 Bot speech
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
}
