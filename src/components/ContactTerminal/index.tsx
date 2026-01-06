import React, { useState, useEffect } from 'react';
import { AtSign, MessageSquare, Github, Twitter, Linkedin, Instagram, ShieldCheck, Send } from 'lucide-react';
import type { Identity, Theme, SocialLinks, Log } from '../../data/types';

interface ContactTerminalProps {
    identity: Identity;
    theme: Theme;
    socialLinks: SocialLinks;
}

const ContactTerminal: React.FC<ContactTerminalProps> = ({ identity, theme, socialLinks }) => {
    const [input, setInput] = useState("");
    const [mode, setMode] = useState<"direct" | "mail" | "chat">("direct");
    const [isProcessing, setIsProcessing] = useState(false);
    const [history, setHistory] = useState<Log[]>([
        { type: 'sys', text: `Node_established. Secure channel open to ${identity.toUpperCase()}.` },
        { type: 'sys', text: 'Commands: /mail, /chat, /clear' }
    ]);

    useEffect(() => {
        const greetings = {
            Marc: "Ready for briefing. State your objective.",
            Steven: "Oh, hello! Sorry, things are a bit... busy here. Message please?",
            Jake: "Habla rápido. No tengo todo el día. What do you want?"
        };
        setHistory(prev => [
            ...prev,
            { type: 'sys', text: `Identity switch: ${identity}. Encrypted tunnel active.` },
            { type: 'sys', text: `${identity}: "${greetings[identity]}"` }
        ]);
    }, [identity]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input || isProcessing) return;

        const cmd = input.toLowerCase().trim();
        setIsProcessing(true);

        // Rate limiting / Processing simulation
        setTimeout(() => {
            let response: Log | null = null;
            if (cmd === '/mail') {
                setMode("mail");
                response = { type: 'sys', text: 'MAIL_PROTOCOL_INITIATED. Sanitizing input...' };
            } else if (cmd === '/chat') {
                setMode("chat");
                response = { type: 'sys', text: 'CHAT_BOT_AI_READY. Identity verified.' };
            } else if (cmd === '/clear') {
                setHistory([]);
                setIsProcessing(false);
                setInput("");
                return;
            } else {
                if (mode === 'mail') {
                    response = { type: 'sys', text: 'ENCRYPTED_PACKET_QUEUED: Relay successful.' };
                } else if (mode === 'chat') {
                    const responses: Record<Identity, string[]> = {
                        Marc: [
                            "Tactical analysis complete. Outcome secured.",
                            "The mission is bigger than your curiosity.",
                            "Khonshu watches. Do not waste my time.",
                            "Field report logged. Proceed with caution."
                        ],
                        Steven: [
                            "Oh, that's a fascinating query! Let me check the archives.",
                            "I think I found something... wait, no, that's just a grocery list.",
                            "Marc is... unavailable. I'm doing my best!",
                            "Brilliant! The Ennead would be impressed."
                        ],
                        Jake: [
                            "You talk too much. Just keep it moving.",
                            "I'm not here to hold your hand.",
                            "Consider it done. Now get lost.",
                            "Street smarts beats data every time. Remember that."
                        ]
                    };
                    const botResponses = responses[identity];
                    response = { type: 'sys', text: `KHONSHU_AI: ${botResponses[Math.floor(Math.random() * botResponses.length)]}` };
                } else {
                    response = { type: 'sys', text: 'MESSAGE_ARCHIVED: Hash generated.' };
                }
            }
            setHistory(prev => [...prev, { type: 'user', text: input }, response].filter((l): l is Log => l !== null));
            setIsProcessing(false);
            setInput("");
        }, 800);
    };

    return (
        <section className="py-40 px-10 max-w-6xl mx-auto" id="contact" aria-labelledby="contact-title">
            <h2 id="contact-title" className="sr-only">Contact Terminal</h2>
            <div className="flex flex-col md:flex-row gap-16">
                <nav className="md:w-32 flex md:flex-col gap-6 items-center justify-center" aria-label="Contact Modes and Social Links">
                    <button
                        onClick={() => { setMode('mail'); setInput('/mail'); }}
                        aria-label="Switch to Direct Mail Protocol"
                        aria-pressed={mode === 'mail'}
                        className={`p-6 rounded-3xl border transition-all duration-300 transform hover:-translate-y-2 active:scale-95 ${mode === 'mail' ? 'bg-white text-black scale-110 shadow-[0_0_30px_rgba(255,255,255,0.3)]' : `bg-white/5 ${theme.border} ${theme.color} hover:bg-white hover:text-black`}`}
                    >
                        <AtSign className="w-6 h-6" aria-hidden="true" />
                    </button>
                    <button
                        onClick={() => { setMode('chat'); setInput('/chat'); }}
                        aria-label="Switch to AI Chat Protocol"
                        aria-pressed={mode === 'chat'}
                        className={`p-6 rounded-3xl border transition-all duration-300 transform hover:-translate-y-2 active:scale-95 ${mode === 'chat' ? 'bg-white text-black scale-110 shadow-[0_0_30px_rgba(255,255,255,0.3)]' : `bg-white/5 ${theme.border} ${theme.color} hover:bg-white hover:text-black`}`}
                    >
                        <MessageSquare className="w-6 h-6" aria-hidden="true" />
                    </button>
                    <div className="h-px w-full bg-white/10 my-4 hidden md:block" aria-hidden="true" />
                    {[
                        { icon: <Github key="gh" />, label: 'github' },
                        { icon: <Twitter key="tw" />, label: 'twitter' },
                        { icon: <Linkedin key="li" />, label: 'linkedin' },
                        { icon: <Instagram key="ig" />, label: 'instagram' }
                    ].map((item, i) => (
                        <a
                            key={i}
                            href={socialLinks[item.label] || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Visit my ${item.label} profile`}
                            className={`p-5 rounded-[1.5rem] border bg-white/5 transition-all duration-500 ${theme.border} ${theme.color} hover:bg-white hover:text-black hover:-translate-y-2 active:scale-95`}
                        >
                            {item.icon}
                        </a>
                    ))}
                </nav>

                <div className={`flex-1 bg-black/80 backdrop-blur-3xl border ${theme.border} rounded-[3rem] overflow-hidden shadow-2xl relative`} role="log" aria-live="polite">
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_100%)] z-10" aria-hidden="true" />

                    <div className="p-6 bg-white/[0.03] border-b border-white/5 flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                            <ShieldCheck className={`w-3 h-3 ${theme.color}`} aria-hidden="true" />
                            <span className="ml-2 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
                                Encrypted Session: <span className={theme.color}>{mode.toUpperCase()}</span>
                            </span>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 opacity-50">Spector_Secure_Layer_v9</span>
                    </div>

                    <div className="p-12 h-[450px] overflow-y-auto font-mono text-[13px] space-y-6 custom-scrollbar relative">
                        {history.map((line, i) => (
                            <div key={i} className={`flex gap-4 animate-in fade-in slide-in-from-left-4 duration-500`}>
                                <span className={line.type === 'sys' ? 'text-slate-600' : theme.color} aria-hidden="true">
                                    {line.type === 'sys' ? ">>>" : "SECURE@NODE:"}
                                </span>
                                <span className={line.type === 'sys' ? 'text-slate-400 italic' : 'text-white'}>{line.text}</span>
                            </div>
                        ))}
                        {isProcessing && (
                            <div className="flex items-center gap-4 text-slate-600 font-mono animate-pulse">
                                <span aria-hidden="true">{" >>> "}</span>
                                <span>Sanitizing_Packet...</span>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 bg-black/40 border-t border-white/5">
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 focus-within:border-white/20 transition-all">
                            <span className={`${theme.color} font-mono animate-pulse`} aria-hidden="true">$</span>
                            <input
                                type="text"
                                disabled={isProcessing}
                                aria-label="Terminal Input Command or Message"
                                placeholder={mode === 'mail' ? "ENTER_MAIL_SUBJECT..." : mode === 'chat' ? "ASK_KHONSHU_ANYTHING..." : "TYPE_MESSAGE_OR_COMMAND..."}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                className="bg-transparent outline-none flex-1 text-white font-mono text-[13px] uppercase tracking-widest placeholder:text-slate-700"
                            />
                            <button type="submit" aria-label="Send Transmission" className={`${theme.color} hover:scale-125 transition-transform disabled:opacity-30`}>
                                <Send className="w-5 h-5" aria-hidden="true" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default React.memo(ContactTerminal);
