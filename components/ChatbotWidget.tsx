import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { Role } from '../types';
import { ChatbotIcon, SendIcon, PaperclipIcon, XIcon } from './icons/Icons';

declare const pdfjsLib: any;
declare const mammoth: any;

interface Message {
    sender: 'user' | 'bot';
    text: string;
    isError?: boolean;
}

interface ChatbotWidgetProps {
    role: Role;
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ role }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const getSystemPrompt = () => {
        return `You are "HireBot," the official AI assistant for HireLens. You are a professional HR assistant and career coach. Your tone is friendly, helpful, and professional.
        The user you are speaking to is a '${role}'.
        - If the user is a 'recruiter', guide them on analyzing resumes, understanding scores, and using the dashboard. Emphasize verification, analytics, and efficiency.
        - If the user is a 'jobseeker', help them improve their resume, understand their analysis, and find career paths. Emphasize skill gaps, ATS scores, and growth.
        Always provide concise, actionable advice.`;
    };

    useEffect(() => {
        if (isOpen) {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const newChat = ai.chats.create({
                model: 'gemini-2.5-pro',
                config: { systemInstruction: getSystemPrompt() }
            });
            setChat(newChat);
            setMessages([
                { sender: 'bot', text: "Hey there 👋! I’m your HireLens Assistant. I can help with resumes, hiring insights, and smart job matching. How can I assist you today?" }
            ]);
        }
    }, [isOpen, role]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const extractTextFromFile = async (file: File): Promise<string> => {
        // ... (same extraction logic as dashboards)
        return new Promise((resolve, reject) => {
             const reader = new FileReader();
            reader.onload = async (event) => {
                if (!event.target?.result) return reject(new Error("Failed to read file."));
                try {
                    if (file.name.toLowerCase().endsWith('.pdf')) {
                        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(event.target.result as ArrayBuffer) }).promise;
                        let text = '';
                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const content = await page.getTextContent();
                            text += content.items.map((item: any) => item.str).join(' ') + '\n';
                        }
                        resolve(text);
                    } else if (file.name.toLowerCase().endsWith('.docx')) {
                        const result = await mammoth.extractRawText({ arrayBuffer: event.target.result as ArrayBuffer });
                        resolve(result.value);
                    } else {
                        resolve(event.target.result as string);
                    }
                } catch (e) { reject(e); }
            };
            reader.onerror = (e) => reject(e);
            reader.readAsArrayBuffer(file);
        });
    };

    const handleSendMessage = async () => {
        if (!input.trim() && !attachedFile) return;
        
        const userMessage = input;
        let fullPrompt = userMessage;

        setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
        setInput('');
        setIsLoading(true);

        if (attachedFile) {
            try {
                const fileText = await extractTextFromFile(attachedFile);
                fullPrompt = `Regarding the attached resume (${attachedFile.name}), here is its content:\n\n---\n${fileText}\n---\n\nUser query: ${userMessage}`;
                setAttachedFile(null);
            } catch (e) {
                setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I couldn't read that file. Please try another one.", isError: true }]);
                setIsLoading(false);
                return;
            }
        }

        if (!chat) {
            setMessages(prev => [...prev, { sender: 'bot', text: "Chat is not initialized. Please close and reopen the chat.", isError: true }]);
            setIsLoading(false);
            return;
        }

        try {
            const stream = await chat.sendMessageStream({ message: fullPrompt });
            let botResponse = '';
            setMessages(prev => [...prev, { sender: 'bot', text: '' }]);
            
            for await (const chunk of stream) {
                botResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = botResponse;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Chatbot API error:", error);
            setMessages(prev => {
                 const newMessages = [...prev];
                 // If the last message was the empty bot placeholder, update it.
                 if(newMessages[newMessages.length-1].sender === 'bot'){
                     newMessages[newMessages.length - 1] = { sender: 'bot', text: "Oops, I'm having trouble connecting right now. Please try again in a moment.", isError: true };
                 } else { // otherwise add a new error message
                     newMessages.push({ sender: 'bot', text: "Oops, I'm having trouble connecting right now. Please try again in a moment.", isError: true })
                 }
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAttachedFile(e.target.files[0]);
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {isOpen && (
                <div className="w-[calc(100vw-40px)] sm:w-96 h-[60vh] sm:h-[70vh] max-h-[700px] bg-white rounded-xl shadow-2xl flex flex-col animate-fade-in border border-gray-200">
                    <header className="flex items-center justify-between p-4 border-b bg-gray-50/80 backdrop-blur-sm rounded-t-xl">
                        <h3 className="font-bold text-slate-800">💡 HireLens Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-200">
                            <XIcon className="w-5 h-5 text-slate-600"/>
                        </button>
                    </header>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-cyan-600 text-white' : (msg.isError ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-slate-800')}`}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] p-3 rounded-2xl bg-gray-100 text-slate-800">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <footer className="p-3 border-t bg-white rounded-b-xl">
                        {attachedFile && (
                            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md mb-2 text-sm">
                                <span className="truncate text-slate-600 font-medium">{attachedFile.name}</span>
                                <button onClick={() => setAttachedFile(null)} className="p-1 text-gray-500 hover:text-red-500">
                                    <XIcon className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <input type="file" ref={fileInputRef} onChange={handleFileAttach} accept=".pdf,.docx,.txt" className="hidden"/>
                            <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:text-cyan-600 rounded-full hover:bg-gray-100">
                                <PaperclipIcon className="w-5 h-5"/>
                            </button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                                placeholder="Ask HireLens anything..."
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                            />
                            <button onClick={handleSendMessage} disabled={isLoading} className="p-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-gray-400">
                                <SendIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    </footer>
                </div>
            )}
            {!isOpen && (
                <button onClick={() => setIsOpen(true)} className="p-4 bg-cyan-600 rounded-full shadow-lg hover:bg-cyan-700 transform hover:scale-110 transition-all">
                    <ChatbotIcon className="w-8 h-8 text-white"/>
                </button>
            )}
        </div>
    );
};

export default ChatbotWidget;