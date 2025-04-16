import React, { useState, useRef } from "react";
import "./Chatbot_ui.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! 🚦 How can I assist you with traffic today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const chatRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { text: data.response || "🚦 I’m here to assist with traffic, accidents, and routes.", sender: "bot" }]);
    } catch (error) {
      setMessages((prev) => [...prev, { text: "🚦 Oops! I'm experiencing a delay. Please try again.", sender: "bot" }]);
    }
    setIsTyping(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  // Drag functionality
  const handleDragStart = (event) => {
    const chatbot = chatRef.current;
    const shiftX = event.clientX - chatbot.getBoundingClientRect().left;
    const shiftY = event.clientY - chatbot.getBoundingClientRect().top;

    const moveAt = (pageX, pageY) => {
      chatbot.style.left = `${pageX - shiftX}px`;
      chatbot.style.top = `${pageY - shiftY}px`;
    };

    const onMouseMove = (event) => {
      moveAt(event.pageX, event.pageY);
    };

    document.addEventListener("mousemove", onMouseMove);

    document.onmouseup = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.onmouseup = null;
    };
  };

  return (
    <div
      ref={chatRef}
      className={`chatbot-container ${isMaximized ? "maximized" : ""}`}
      onMouseDown={handleDragStart}
    >
      <div className="chat-header">
        Smart Traffic Bot 🚦
        <button className="maximize-btn" onClick={toggleMaximize}>
          {isMaximized ? "🔽" : "🔼"}
        </button>
      </div>

      <div className="chat-body">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === "bot" ? "bot-message" : "user-message"}>
            {msg.text}
          </div>
        ))}

        {isTyping && (
          <div className="bot-message typing-indicator">
            <span></span><span></span><span></span>
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask me about traffic updates..."
        />
        <button onClick={handleSend}>➤</button>
      </div>
    </div>
  );
};

export default Chatbot;
