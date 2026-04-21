"use client";

import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext({
  isChatOpen: false,
  openChat: () => {},
  closeChat: () => {},
  toggleChat: () => {},
});

export function ChatProvider({ children }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm AETHER, your friendly digital assistant. How can I help you build something amazing today?" }
  ]);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);
  const toggleChat = () => setIsChatOpen(prev => !prev);
  
  const sendMessage = (text, role = "user") => {
    setMessages(prev => [...prev, { role, content: text }]);
    openChat();
  };

  return (
    <ChatContext.Provider value={{ 
      isChatOpen, 
      openChat, 
      closeChat, 
      toggleChat, 
      messages, 
      setMessages, 
      sendMessage 
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
