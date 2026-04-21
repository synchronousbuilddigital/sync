"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Send, X, Bot, Zap } from "lucide-react";
import { useTheme } from './ThemeContext';
import { useChat } from './ChatContext';
import InteractiveEye from './InteractiveEye';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ChatBot() {
    const { isDark } = useTheme();
    const pathname = usePathname();
    const { isChatOpen, toggleChat, openChat, closeChat, messages, setMessages } = useChat();
    const isOpen = isChatOpen;
    const setIsOpen = (val) => {
        if (typeof val === 'boolean') {
            val ? openChat() : closeChat();
        } else {
            toggleChat();
        }
    };
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    // Auto-respond to new user messages
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.role === "user" && !isLoading) {
            triggerAIResponse();
        }
    }, [messages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading, isOpen]);

    const triggerAIResponse = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: messages, currentUrl: pathname }),
            });

            const data = await response.json();
            
            if (response.ok && data.message) {
                setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
            } else {
                const errorMessage = data.message || "Oops, I lost connection. Could you try sending that again?";
                setMessages(prev => [...prev, {
                    role: "assistant",
                    content: errorMessage
                }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Sorry, a network error occurred."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = (chipText = null) => {
        const text = typeof chipText === "string" ? chipText : inputValue;
        if (!text.trim() || isLoading) return;
        const userMessage = { role: "user", content: text };
        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none group font-sans">

            {/* AI Control Center Trigger */}
            <motion.div
                className="relative z-20 pointer-events-auto"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative flex items-center justify-center cursor-pointer overflow-visible"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isOpen ? (
                        <div className={`w-14 h-14 md:w-16 md:h-16 ${!isDark ? 'bg-white border-[#F05E23]/20 shadow-2xl' : 'bg-[#111] border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'} rounded-full flex items-center justify-center border-2 relative group/close`}>
                            <X className={`w-6 h-6 ${!isDark ? 'text-[#111]' : 'text-white'} relative z-10 transition-transform group-hover/close:rotate-90 duration-500`} />
                        </div>
                    ) : (
                        <div className="relative">
                            <InteractiveEye className={`drop-shadow-[0_20px_50px_rgba(240,94,35,0.3)] ${!isDark ? '' : 'brightness-125'}`} />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className={`absolute -inset-4 border border-dashed ${!isDark ? 'border-[#F05E23]/20' : 'border-white/20'} rounded-full pointer-events-none`}
                            ></motion.div>
                        </div>
                    )}
                </motion.button>

                {/* The HUD Interface */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50, rotate: 2, originY: 1, originX: 1 }}
                            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50, rotate: -2 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className={`absolute bottom-20 md:bottom-24 right-0 w-[300px] md:w-[360px] h-[450px] md:h-[520px] backdrop-blur-3xl border rounded-[2rem] overflow-hidden z-[9999] flex flex-col pointer-events-auto origin-bottom-right transition-all duration-500 ${
                                !isDark 
                                ? 'bg-white/95 border-white/40 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)]' 
                                : 'bg-[#0A0A0A]/95 border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]'
                            }`}
                        >
                            {/* Premium Header */}
                            <div className={`p-4 md:p-5 border-b flex items-center justify-between relative overflow-hidden transition-colors duration-500 ${!isDark ? 'border-black/5 bg-white/20' : 'border-white/5 bg-white/5'}`}>
                                <div className="flex items-center gap-3 relative z-10">
                                    <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center shadow-md relative group transition-colors ${!isDark ? 'bg-[#111]' : 'bg-white'}`}>
                                        <Bot className={`w-5 h-5 md:w-6 md:h-6 ${!isDark ? 'text-[#F05E23]' : 'text-[#111]'}`} />
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                            className={`absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 ${!isDark ? 'border-white' : 'border-[#0A0A0A]'}`}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className={`font-bold text-base md:text-lg tracking-tight transition-colors ${!isDark ? 'text-[#111]' : 'text-white'}`}>AETHER</h3>
                                        <span className={`text-[0.55rem] font-black tracking-[0.2em] uppercase transition-colors ${!isDark ? 'text-orange-500' : 'text-orange-400'}`}>AI ASSISTANT</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className={`w-8 h-8 md:w-9 md:h-9 border rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                                        !isDark 
                                        ? 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50' 
                                        : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                                    }`}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Conversation Stream */}
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scrollbar-hide relative min-h-0"
                            >
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex flex-col gap-3 ${msg.role === 'user' ? 'items-end text-right' : 'items-start'}`}
                                    >
                                        <span className={`text-[0.5rem] md:text-[0.55rem] font-black px-2.5 py-1 rounded-full tracking-[0.2em] uppercase transition-colors ${
                                            msg.role === 'assistant' 
                                            ? 'text-orange-600 bg-orange-100 dark:bg-orange-950/40 dark:text-orange-400' 
                                            : 'text-slate-500 bg-slate-100 dark:bg-white/10 dark:text-slate-400'
                                        }`}>
                                            {msg.role === 'assistant' ? 'AETHER' : 'YOU'}
                                        </span>
                                        <div className={`text-[0.75rem] md:text-[0.85rem] leading-snug p-4 md:p-5 rounded-2xl md:rounded-[2rem] max-w-[95%] shadow-sm border transition-all duration-300 ${
                                            msg.role === 'assistant' 
                                            ? (!isDark ? 'text-[#333] bg-white border-black/5 rounded-tl-none' : 'text-white/90 bg-white/5 border-white/5 rounded-tl-none')
                                            : (!isDark ? 'text-white bg-[#111] border-[#111] rounded-tr-none' : 'text-[#111] bg-white border-white rounded-tr-none')
                                        }`}>
                                            {msg.role === 'assistant' ? (
                                                <div className="prose prose-sm dark:prose-invert max-w-none text-[0.75rem] md:text-[0.85rem] leading-snug space-y-1 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:my-1 [&>p]:mb-1 [&>strong]:font-black text-inherit">
                                                    <ReactMarkdown
                                                        components={{
                                                            a: ({node, ...props}) => {
                                                                const isInternal = props.href?.startsWith('/');
                                                                if (isInternal) {
                                                                    return (
                                                                        <Link 
                                                                            href={props.href} 
                                                                            onClick={() => setIsOpen(false)}
                                                                            className={`flex items-center justify-center gap-2 mt-4 px-6 py-3 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest transition-all duration-500 hover:scale-[1.02] active:scale-95 shadow-xl ${!isDark ? 'bg-[#111] text-white hover:bg-[#F05E23]' : 'bg-white text-[#111] hover:bg-[#F05E23] hover:text-white'} no-underline border-none`}
                                                                        >
                                                                            {props.children}
                                                                        </Link>
                                                                    );
                                                                }
                                                                if (props.href?.startsWith('https://wa.me/')) {
                                                                    return (
                                                                        <a 
                                                                            href={props.href} 
                                                                            target="_blank" rel="noopener noreferrer"
                                                                            className="flex items-center justify-center gap-2 mt-4 px-6 py-3 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest transition-all duration-500 hover:scale-[1.02] active:scale-95 shadow-xl bg-[#25D366] text-white hover:bg-[#128C7E] no-underline border-none"
                                                                        >
                                                                            <Zap className="w-3 h-3 fill-current" />
                                                                            {props.children}
                                                                        </a>
                                                                    );
                                                                }
                                                                return <a {...props} target="_blank" rel="noopener noreferrer" className="text-[#F05E23] hover:underline" />;
                                                            }
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                </div>
                                            ) : (
                                                msg.content
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                                {isLoading && (
                                    <div className="flex flex-col gap-3 items-start">
                                        <div className={`p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] rounded-tl-none shadow-sm flex items-center justify-center min-w-[80px] ${!isDark ? 'bg-white border border-black/5' : 'bg-white/5 border border-white/5'}`}>
                                            <div className="flex gap-1.5">
                                                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-[#F05E23] rounded-full"></motion.div>
                                                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#F05E23] rounded-full"></motion.div>
                                                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#F05E23] rounded-full"></motion.div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Command Input Area */}
                            <div className={`p-4 md:p-5 relative border-t transition-colors duration-500 ${!isDark ? 'bg-white/50 border-black/5' : 'bg-black/20 border-white/5'}`}>
                                {messages.length <= 1 && (
                                    <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide relative z-10 w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                        {["View Case Studies", "How do you work?", "Start a Project"].map((chip, idx) => (
                                            <button 
                                                key={idx}
                                                onClick={() => handleSend(chip)}
                                                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[0.65rem] font-bold border transition-colors flex-shrink-0 ${!isDark ? 'bg-white border-black/10 text-slate-600 hover:border-[#F05E23] hover:text-[#F05E23]' : 'bg-black/40 border-white/10 text-white/60 hover:border-[#F05E23] hover:text-orange-400'}`}
                                            >
                                                {chip}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <div className="relative flex items-center gap-2 md:gap-3">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSend();
                                        }}
                                        placeholder="Type your message..."
                                        className={`flex-1 border rounded-full py-3 px-5 text-[0.85rem] font-bold transition-all shadow-inner focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/40 ${
                                            !isDark 
                                            ? 'bg-white border-slate-200 text-[#111] placeholder:text-slate-300' 
                                            : 'bg-white/5 border-white/10 text-white placeholder:text-white/20'
                                        }`}
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!inputValue.trim() || isLoading}
                                        className={`w-11 h-11 md:w-12 md:h-12 rounded-[1rem] flex items-center justify-center transition-all duration-500 shadow-lg cursor-pointer disabled:opacity-30 flex-shrink-0 ${
                                            !isDark ? 'bg-[#111] text-white hover:bg-orange-600' : 'bg-white text-[#111] hover:bg-orange-500'
                                        }`}
                                    >
                                        <Send className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                                    </button>
                                </div>

                                <div className="mt-4 md:mt-6 flex items-center justify-between px-2 gap-4">
                                    <div className={`flex items-center gap-4 text-[0.55rem] md:text-[0.6rem] font-black uppercase tracking-widest transition-colors ${!isDark ? 'text-slate-400' : 'text-white/40'}`}>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
                                            <span>Online</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <motion.a
                                            href="https://wa.me/919161391566"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[0.55rem] md:text-[0.6rem] font-black uppercase tracking-wider transition-all shadow-sm cursor-pointer ${
                                                !isDark 
                                                ? 'bg-green-50 text-green-600 border border-green-100 hover:bg-green-100' 
                                                : 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
                                            }`}
                                        >
                                            <Zap className="w-3 h-3 fill-current" />
                                            Direct Link
                                        </motion.a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
