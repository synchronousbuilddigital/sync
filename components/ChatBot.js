"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Send, X, Sparkles, Bot, User, Loader2, Globe, Command, Mic, MicOff, Volume2, VolumeX } from "lucide-react";

import InteractiveEye from './InteractiveEye';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Architecture analysis complete. SYNCRO is online. How shall we accelerate your success today?" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
    const scrollRef = useRef(null);
    const recognitionRef = useRef(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = false;
                recognitionRef.current.lang = 'en-US';

                recognitionRef.current.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    setInputValue(transcript);
                    setIsListening(false);
                };

                recognitionRef.current.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    setIsListening(false);
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };
            }
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setIsListening(true);
            recognitionRef.current?.start();
        }
    };

    const speak = (text) => {
        if (isVoiceEnabled && typeof window !== 'undefined') {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            // Dynamic language detection (very basic)
            if (/[\u0900-\u097F]/.test(text)) {
                utterance.lang = 'hi-IN';
            } else {
                utterance.lang = 'en-US';
            }
            window.speechSynthesis.speak(utterance);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
        // Speak the last message if it's from the assistant
        const lastMsg = messages[messages.length - 1];
        if (lastMsg?.role === "assistant" && isOpen) {
            speak(lastMsg.content);
        }
    }, [messages, isLoading, isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = { role: "user", content: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            const data = await response.json();
            if (data.message) {
                setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
            } else {
                setMessages(prev => [...prev, { 
                    role: "assistant", 
                    content: "Neural link desynchronized. Please re-initiate command logic. | तंत्रिका प्रणाली में त्रुटि। कृपया पुनः प्रयास करें।" 
                }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { 
                role: "assistant", 
                content: "Transmission failed. Network instability detected. | संचरण बाधित। अपना नेटवर्क जांचें।" 
            }]);
        } finally {
            setIsLoading(false);
        }
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
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center border-2 border-[#F05E23]/20 shadow-2xl relative group/close">
                             <div className="absolute inset-0 bg-gradient-to-tr from-[#F05E23]/10 to-transparent opacity-0 group-hover/close:opacity-100 transition-all duration-500 rounded-full"></div>
                             <X className="w-8 h-8 text-[#111] relative z-10 transition-transform group-hover/close:rotate-90 duration-500" />
                        </div>
                    ) : (
                        <div className="relative">
                            <InteractiveEye className="drop-shadow-[0_20px_50px_rgba(240,94,35,0.3)]" />
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-4 border border-dashed border-[#F05E23]/20 rounded-full pointer-events-none"
                            ></motion.div>
                        </div>
                    )}

                    {!isOpen && (
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="absolute right-24 bg-white/90 backdrop-blur-md text-[#F05E23] font-black px-6 py-3 rounded-2xl shadow-xl text-[0.65rem] uppercase tracking-[0.3em] border border-orange-100/50 hidden md:block pointer-events-none"
                        >
                            INIT_NEURAL_LINK
                        </motion.div>
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
                            className="absolute bottom-24 right-0 w-[340px] md:w-[450px] h-[580px] md:h-[680px] backdrop-blur-3xl border border-white/40 rounded-[3rem] overflow-hidden z-[9999] flex flex-col pointer-events-auto origin-bottom-right shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]"
                            style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}
                        >
                            {/* Premium Header */}
                            <div className="p-8 pb-6 border-b border-[rgba(0,0,0,0.05)] flex items-center justify-between relative overflow-hidden">
                                <div className="flex items-center gap-5 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-[#111] flex items-center justify-center shadow-lg relative group">
                                        <Bot className="w-7 h-7 text-[#F05E23]" />
                                        <motion.div 
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-white"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-[#111] font-bold text-xl tracking-tighter">SYNCRO AI</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[0.6rem] font-black tracking-[0.3em] text-orange-500 uppercase">SYNCHRONOUS</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 z-10">
                                    <button 
                                        onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isVoiceEnabled ? 'bg-[#F05E23] text-white' : 'bg-[#FAFAF8] text-slate-400 border border-slate-100'}`}
                                        title={isVoiceEnabled ? "Mute Voice" : "Enable Voice Output"}
                                    >
                                        {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="w-10 h-10 bg-[#FAFAF8] text-slate-400 border border-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-all cursor-pointer"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Conversation Stream */}
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide relative min-h-0"
                            >
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex flex-col gap-4 ${msg.role === 'user' ? 'items-end text-right' : 'items-start'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[0.55rem] font-black px-2.5 py-1 rounded-full tracking-[0.2em] uppercase ${msg.role === 'assistant' ? 'text-orange-600 bg-orange-100' : 'text-slate-500 bg-slate-100'
                                                }`}
                                            >
                                                {msg.role === 'assistant' ? 'Syncro_Neural' : 'Authorized_Client'}
                                            </span>
                                        </div>
                                        <div className={`text-[0.9rem] md:text-[1rem] leading-relaxed p-6 rounded-[2.5rem] max-w-[95%] shadow-[0_10px_30px_rgba(0,0,0,0.03)] border transition-all ${msg.role === 'assistant' ? 'text-[#333] bg-white border-white/50 rounded-tl-none font-medium' : 'text-white bg-[#111] border-[#111] rounded-tr-none font-semibold'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </motion.div>
                                ))}
                                {isLoading && (
                                    <div className="flex flex-col gap-4 items-start">
                                        <div className="bg-white border-white/50 p-6 rounded-[2.5rem] rounded-tl-none shadow-sm flex items-center justify-center min-w-[100px]">
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
                            <div className="p-8 bg-white/50 relative border-t border-[rgba(0,0,0,0.04)]"
                            >
                                <div className="relative flex items-center gap-3">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleSend();
                                            }}
                                            placeholder={isListening ? "Listening..." : "Transmit message..."}
                                            className={`w-full bg-white border ${isListening ? 'border-[#F05E23] ring-4 ring-[#F05E23]/10' : 'border-slate-200'} rounded-3xl py-5 px-8 pr-16 text-[0.95rem] font-bold text-[#111] focus:outline-none focus:ring-4 focus:ring-[#F05E23]/10 focus:border-[#F05E23] transition-all shadow-inner placeholder:text-slate-300 placeholder:font-normal`}
                                        />
                                        <button 
                                            onClick={toggleListening}
                                            className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isListening ? 'bg-red-500 text-white animate-pulse shadow-lg' : 'bg-[#FAFAF8] text-slate-400 hover:text-[#F05E23]'}`}
                                        >
                                            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleSend}
                                        disabled={!inputValue.trim() || isLoading}
                                        className="w-14 h-14 bg-[#111] text-white rounded-[1.5rem] flex items-center justify-center hover:bg-[#F05E23] transition-all duration-500 shadow-xl cursor-pointer disabled:opacity-30 flex-shrink-0"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="mt-6 flex items-center justify-between opacity-50 px-2">
                                    <div className="flex items-center gap-4 text-[0.6rem] font-black uppercase tracking-widest text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                            <span>Link_Active</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Globe className="w-3 h-3" />
                                            <span>Voice_Sync</span>
                                        </div>
                                    </div>
                                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
