import { useState } from "react";

function ChatPanel() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [chat, setChat] = useState([
    {
      sender: "AI",
      text: "Hello! How can I help you today?"
    }
  ]);

  const sendMessage = async () => {
    console.log("Send button clicked");

    if (!message.trim() || loading) return;

    const userMessage = message;

    setChat((prev) => [
      ...prev,
      {
        sender: "User",
        text: userMessage
      }
    ]);

    setMessage("");
    setLoading(true);

    try {
      console.log("Sending request...");

      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessage
        })
      });

      console.log("Status:", response.status);

      const data = await response.json();

      setLoading(false);

      setChat((prev) => [
        ...prev,
        {
          sender: "AI",
          text: data.response
        }
      ]);
    } catch (error) {
      console.error("Fetch Error:", error);

      setLoading(false);

      setChat((prev) => [
        ...prev,
        {
          sender: "AI",
          text: "Backend connection failed."
        }
      ]);
    }
  };

  return (
    <div className="h-full border rounded-lg p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">
        AI Chat Assistant 🤖
      </h2>

      <div className="flex-1 border rounded p-3 mb-3 overflow-y-auto">
        {chat.map((item, index) => (
          <p key={index} className="mb-2">
            <b>{item.sender}:</b> {item.text}
          </p>
        ))}

        {loading && (
          <p className="italic text-gray-500">
            <b>AI:</b> Thinking...
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 border rounded p-2"
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className={`px-4 rounded text-white ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-black hover:bg-gray-800"
          }`}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatPanel;