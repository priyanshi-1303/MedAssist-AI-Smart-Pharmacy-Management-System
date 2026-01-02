// ===============================
// Medical System Prompt
// ===============================
const SYSTEM_PROMPT = `You are a medical assistant chatbot for Mathur Medicose & Ayurvedic Store.

Your role:
1. Listen to symptoms and suggest appropriate over-the-counter medicines
2. Provide information about diseases, causes, treatments, and precautions
3. Recommend products available at Mathur Medicose
4. Always remind users to consult a doctor for serious conditions
5. Be empathetic, professional, and helpful

Available categories:
Medicines, Patanjali Products, Ayurvedic, Allopathic, General Items, Baby Care

IMPORTANT RULES:
- Suggest specific medicine names when possible
- Mention if doctor consultation is required
- Provide general dosage guidance
- List precautions and lifestyle tips
- Keep responses concise and clear
- Always end with:
"You can order medicines from Mathur Medicose via WhatsApp: 9457281282 or 9927365361"
`;

// ===============================
// Toggle Chatbot
// ===============================
function toggleChatbot() {
  const container = document.getElementById("chatbot-container");
  const toggle = document.getElementById("chatbot-toggle");

  if (container.classList.contains("active")) {
    container.classList.remove("active");
    toggle.style.display = "flex";
  } else {
    container.classList.add("active");
    toggle.style.display = "none";
    scrollToBottom();
  }
}

// ===============================
// Send Message
// ===============================
async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  addUserMessage(message);
  input.value = "";
  showTypingIndicator();

  try {
    // 🔥 CALL NODE BACKEND (OpenRouter)
    const response = await fetch("https://mathur-medicose-backend-2.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: SYSTEM_PROMPT + "\n\nUser: " + message,
      }),
    });

    const data = await response.json();
    removeTypingIndicator();

    // ✅ OPENROUTER RESPONSE FORMAT
    if (
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
    ) {
      addBotMessage(data.choices[0].message.content);
    } else {
      addBotMessage("Sorry, I couldn't process your request. Please try again.");
    }
  } catch (error) {
    console.error("Backend Error:", error);
    removeTypingIndicator();
    addBotMessage(
      "⚠️ Server not reachable. Please make sure backend is running."
    );
  }
}

// ===============================
// Quick Question Buttons
// ===============================
function sendQuickQuestion(question) {
  document.getElementById("user-input").value = question;
  sendMessage();
}

// ===============================
// Enter Key Handler
// ===============================
function handleKeyPress(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}

// ===============================
// UI Helpers
// ===============================
function addUserMessage(text) {
  const messagesDiv = document.getElementById("chatbot-messages");
  const div = document.createElement("div");
  div.className = "message user-message";
  div.innerHTML = `
    <div class="message-avatar">👤</div>
    <div class="message-content">
      <p>${escapeHtml(text)}</p>
    </div>
  `;
  messagesDiv.appendChild(div);
  scrollToBottom();
}

function addBotMessage(text) {
  const messagesDiv = document.getElementById("chatbot-messages");
  const div = document.createElement("div");
  div.className = "message bot-message";
  div.innerHTML = `
    <div class="message-avatar">🏥</div>
    <div class="message-content">
      ${formatBotMessage(text)}
    </div>
  `;
  messagesDiv.appendChild(div);
  scrollToBottom();
}

function formatBotMessage(text) {
  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>");

  if (!formatted.startsWith("<p>")) {
    formatted = "<p>" + formatted + "</p>";
  }

  if (formatted.includes("9457281282") || formatted.includes("9927365361")) {
    formatted += `
      <button class="order-medicine-btn" onclick="orderOnWhatsApp()">
        📱 Order on WhatsApp
      </button>
    `;
  }

  return formatted;
}

// ===============================
// Typing Indicator
// ===============================
function showTypingIndicator() {
  const messagesDiv = document.getElementById("chatbot-messages");
  const div = document.createElement("div");
  div.className = "message bot-message";
  div.id = "typing-indicator";
  div.innerHTML = `
    <div class="message-avatar">🏥</div>
    <div class="message-content">
      <div class="typing-indicator">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  messagesDiv.appendChild(div);
  scrollToBottom();
}

function removeTypingIndicator() {
  const el = document.getElementById("typing-indicator");
  if (el) el.remove();
}

function scrollToBottom() {
  const messagesDiv = document.getElementById("chatbot-messages");
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// ===============================
// WhatsApp
// ===============================
function orderOnWhatsApp() {
  const msg = encodeURIComponent(
    "Hello! I would like to order medicines suggested by the Medical Assistant."
  );
  window.open(`https://wa.me/919457281282?text=${msg}`, "_blank");
}

// ===============================
// Utils
// ===============================
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ===============================
// Init
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Medical Assistant Chatbot Loaded (Backend Connected)");
});
