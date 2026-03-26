"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Send, X, Sparkles, Terminal, Cpu, Activity } from "lucide-react";

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "bot", content: "Greetings. I am SYNAPTIC. How shall we architect your success?" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [scrambledValue, setScrambledValue] = useState("");
    const scrollRef = useRef(null);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>!@#$%^&*()_+";

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newMessages = [...messages, { role: "user", content: inputValue }];
        setMessages(newMessages);
        setInputValue("");
        setScrambledValue("");

        // Simulated AI response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: "bot",
                content: "Analyzing parameters... The proposed trajectory aligns with our performance targets. Initiating deeper synthesis."
            }]);
        }, 1500);
    };

    const handleInputChange = (e) => {
        const val = e.target.value.toUpperCase();
        setInputValue(val);

        // Hacker scramble effect for the visual input
        if (val.length > scrambledValue.length) {
            const lastChar = val[val.length - 1];
            let iterations = 0;
            const interval = setInterval(() => {
                const randomChar = chars[Math.floor(Math.random() * chars.length)];
                setScrambledValue(val.slice(0, -1) + randomChar);
                iterations++;
                if (iterations > 3) {
                    clearInterval(interval);
                    setScrambledValue(val);
                }
            }, 30);
        } else {
            setScrambledValue(val);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">

            {/* The Neural Core Trigger */}
            <motion.div
                className="relative z-20 pointer-events-auto"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            >
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center group"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {/* Abstract Core Design */}
                    <div className="absolute inset-0 rounded-full blur-2xl animate-pulse"
                        style={{ background: 'rgba(99,102,241,0.08)' }}
                    ></div>

                    {/* Rotating Rings */}
                    <motion.div
                        className="absolute inset-0 border rounded-full"
                        style={{ borderColor: 'rgba(99,102,241,0.15)' }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute inset-2 border rounded-full"
                        style={{ borderColor: 'rgba(139,92,246,0.08)' }}
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />

                    {/* The Nucleus */}
                    <div className="relative w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-3xl rounded-full border border-[rgba(0,0,0,0.06)] flex items-center justify-center overflow-hidden"
                        style={{ boxShadow: '0 0 30px rgba(99,102,241,0.2)' }}
                    >
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div key="close" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <X className="w-4 h-4 text-[#0F1729]" />
                                </motion.div>
                            ) : (
                                <motion.div key="core" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full blur-[2px] animate-pulse"></div>
                                    <div className="absolute inset-[-4px] border border-indigo-500/50 rounded-full animate-ping"></div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.button>

                {/* The "HUD" Interface */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30, originY: 1, originX: 1 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="absolute bottom-24 right-0 w-[320px] md:w-[400px] h-[450px] md:h-[550px] backdrop-blur-3xl border border-[rgba(0,0,0,0.06)] rounded-[2.5rem] overflow-hidden z-[9999] flex flex-col pointer-events-auto origin-bottom-right"
                            style={{ backgroundColor: 'rgba(250,250,248,0.95)', boxShadow: '0 24px 48px -12px rgba(0,0,0,0.15)' }}
                        >
                            {/* HUD Header */}
                            <div className="p-5 border-b border-[rgba(0,0,0,0.05)] flex items-center justify-between"
                                style={{ background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.03), transparent)' }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl border flex items-center justify-center"
                                        style={{ backgroundColor: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.12)' }}
                                    >
                                        <Activity className="w-4 h-4 text-indigo-500" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[0.55rem] font-black tracking-[0.2em] text-[#94A3B8] uppercase">Synaptic Protocol</span>
                                        <h3 className="text-[#0F1729] font-bold text-xs tracking-widest uppercase">System Interaction</h3>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1">
                                        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'rgba(99,102,241,0.3)' }}></div>
                                        <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse"></div>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-1.5 hover:bg-[#F5F5F2] rounded-lg transition-colors group/close"
                                    >
                                        <X className="w-4 h-4 text-[#94A3B8] group-hover/close:text-[#0F1729] transition-colors" />
                                    </button>
                                </div>
                            </div>

                            {/* Terminal Logs */}
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-8 space-y-6 font-mono scrollbar-hide"
                            >
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex flex-col gap-2"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[0.55rem] font-black px-1.5 py-0.5 rounded ${msg.role === 'bot' ? 'text-indigo-500' : 'text-[#4A5568]'
                                                }`}
                                                style={{ backgroundColor: msg.role === 'bot' ? 'rgba(99,102,241,0.08)' : 'rgba(0,0,0,0.04)' }}
                                            >
                                                {msg.role.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className={`text-[0.75rem] md:text-[0.8rem] leading-relaxed tracking-tight ${msg.role === 'bot' ? 'text-[#4A5568]' : 'text-indigo-500'
                                            }`}>
                                            {msg.role === 'user' ? `> ${msg.content}` : msg.content}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Command Input Area */}
                            <div className="px-10 py-8 border-t border-[rgba(0,0,0,0.05)] relative group"
                                style={{ backgroundColor: 'rgba(245,245,242,0.5)' }}
                            >
                                <div className="relative flex items-center gap-4">
                                    <span className="text-indigo-500 font-mono text-sm leading-none shrink-0 group-hover:animate-pulse">{`>>`}</span>

                                    <div className="relative flex-1">
                                        {/* Invisible Real Input */}
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={handleInputChange}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-text z-20 outline-none"
                                            autoFocus
                                        />

                                        {/* Visual Hacker UI Overlay */}
                                        <div className="w-full text-[0.75rem] font-mono text-indigo-500 min-h-[1.5rem] flex items-center tracking-[0.1em] uppercase">
                                            {scrambledValue}
                                            <motion.span
                                                animate={{ opacity: [1, 0, 1] }}
                                                transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                                                className="inline-block w-2 h-3.5 ml-1"
                                                style={{ backgroundColor: 'rgba(99,102,241,0.3)' }}
                                            />
                                            {inputValue.length === 0 && (
                                                <span className="text-[#d1d1d6] ml-1 pointer-events-none tracking-[0.1em] font-light">INITIATE_COMMAND_LINK...</span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSend}
                                        className="p-1.5 text-[#94A3B8] hover:text-indigo-500 transition-all duration-300 hover:scale-110 z-30"
                                    >
                                        <Terminal className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Bottom Glowing Border */}
                                <div className="absolute bottom-0 left-0 w-full h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                                    style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.1), transparent)' }}
                                ></div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
