import React, { useState, useRef, useEffect } from "react";
import "./ChatWidget.css";
import { askOpenAI } from "../api/openai";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    // Add user's message
    const userMessage = input;
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");

    // Ask OpenAI for a reply
    const reply = await askOpenAI(userMessage);

    // Add bot reply
    setMessages((prev) => [...prev, { from: "bot", text: reply }]);
  }

  return (
    <>
      {/* Floating Button */}
      <div className="chat-btn" onClick={() => setOpen(!open)}>
        💬
      </div>

      {/* Chat Window */}
      <div className={`chat-window ${open ? "open" : ""}`}>
        <div className="chat-header">
          <b>DRG Support Bot</b>
          <span className="close-btn" onClick={() => setOpen(false)}>✖</span>
        </div>

        <div className="chat-body">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-msg ${msg.from === "user" ? "user" : "bot"}`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input-box">
          <input
            className="chat-input"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="chat-send-btn" onClick={sendMessage}>Send</button>
        </div>
      </div>
    </>
  );
}
