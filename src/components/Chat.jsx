import React, { useState, useEffect, useRef } from "react";
import "./Chat.css"; // Đảm bảo tạo file này để thêm CSS

function Chat({ audioData, audioDataResponse, onChatDataSend, avatarSelect, languageSelect }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef(null);

  const handleAvatarAndLanguageChange = ()=>{
    setMessages([]);
  }

  useEffect(() => {
    if (audioData) {
      console.log("New audio data received in Chat:", audioData);
      // Tạo một tin nhắn mới với audioData như nội dung
      const newUserAudioMessage = {
        text: audioData,
        isUser: true,
        timestamp: new Date().toLocaleTimeString("vn-VN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };

      // Cập nhật danh sách tin nhắn
      setMessages([...messages, newUserAudioMessage]);
    }
  }, [audioData]);

  useEffect(() => {
    if (audioDataResponse) {
      console.log("New audio data received in Chat:", audioDataResponse);
      // Tạo một tin nhắn mới với audioData như nội dung
      const newALdaAudioMessage = {
        text: audioDataResponse,
        isUser: false, // Giả sử rằng audioData là từ một nguồn ngoài, không phải từ người dùng
        timestamp: new Date().toLocaleTimeString("vn-VN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };

      // Cập nhật danh sách tin nhắn
      setMessages([...messages, newALdaAudioMessage]);
    }
  }, [audioDataResponse]);

  useEffect(()=>{
    handleAvatarAndLanguageChange()
  },[languageSelect, avatarSelect])

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (event) => {
    event.preventDefault();
    if (input.trim() !== "") {
      const newChatMessage = {
        text: input,
        isUser: true,
        timestamp: new Date().toLocaleTimeString("vn-VN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };
      setMessages([...messages, newChatMessage]);
      onChatDataSend(newChatMessage.text);
      setInput("");
    }
  };

  return (
    <div className="chat-box">
      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.isUser ? "user-message" : "other-message"
            }`}
          >
            <img
              src={
                message.isUser
                  ? "user_profile.png"
                  : `Avatar\\${avatarSelect}.png`
              }
              className="avatar"
              alt="avatar"
            />
            <div className="text-and-time">
              <p>{message.text}</p>
              <span className="timestamp">{message.timestamp}</span>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          style={{
            backgroundColor: "#38393A",
          }}
          type="submit"
          className="btn send-button"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
