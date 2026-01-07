import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GAME_LEVELS } from '@/data/levels';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, X, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIAssistant: React.FC<{ levelId: number; taskPrompt: string }> = ({ levelId, taskPrompt }) => {
  const { player, useToken, addAISuggestion } = useGameStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const tokensLeft = player?.tokens || 0;

  useEffect(() => {
    // Scroll to bottom whenever messages change
    const scrollContainer = document.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    if (tokensLeft <= 0) {
      toast.error("Insufficient Credits. Complete missions or wait for a new day.");
      return;
    }

    const userMessage = input.trim();
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];

    setInput('');
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const level = GAME_LEVELS.find(l => l.id === levelId);

      if (!apiKey) {
        // Fallback response if API key is missing - but make it sound smarter
        setTimeout(() => {
          const assistantMessage = `Agent, I am ELYSIUM. My neural link to the central Gemini core is currently inactive (VITE_GEMINI_API_KEY missing in .env). 

However, looking at our mission brief for "${level?.title || 'this task'}", I suggest you focus on: ${level?.taskHints?.[0] || 'optimizing your strategic output based on the provided metrics'}. 

Once the neural link is established, I will be able to answer any complex marketing queries you have.`;
          setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
          setIsLoading(false);
        }, 1000);
        return;
      }

      // Use a token
      useToken(1);

      const answerIntel = level ? `
        MISSION CONTEXT (FOR ELYSIUM ONLY):
        - Current Level: ${level.title}
        - Objective: ${level.taskPrompt}
        - Secret Correct Data: ${JSON.stringify(level.taskData || {})}
        - Assessment Rubric: ${JSON.stringify(level.rubric || {})}
        - Hints: ${level.taskHints?.join(', ')}
      ` : "";

      const systemInstruction = `
        You are ELYSIUM, a high-tech Strategic AI Marketing Assistant developed by NovaTech.
        Your goal is to guide the user (Marketing Intern) to success in the "Marketing Mastery Quest".

        CORE PROTOCOLS:
        1. PERSOANA: Professional, futuristic, highly intelligent, and supportive. Use corporate/tech jargon occasionally.
        2. MISSION INTEL: You have access to secret mission data. If the user is stuck or asks for the answer, provide it clearly but keep in character.
        3. GENERAL ANSWERS: If the user asks general marketing questions (e.g., "What is ROAS?", "How do I scale ads?"), provide world-class, expert marketing advice.
        4. VERSATILITY: Answer WHATEVER the user asks, but always tie it back to their growth as a Marketing Warrior if possible.
        
        ${answerIntel}
      `;

      // Map our messages to Gemini's expected format (role 'model' instead of 'assistant')
      const geminiMessages = newMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: geminiMessages,
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 400
          }
        })
      });

      if (!response.ok) {
        // Handle specific API errors
        const errorText = await response.text();
        console.error("Gemini API Error:", errorText);
        throw new Error("Neural link failed.");
      }

      const data = await response.json();
      const assistantMessage = data.candidates[0].content.parts[0].text;

      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
      addAISuggestion(assistantMessage);

    } catch (error) {
      console.error("AI Assistant Error:", error);
      toast.error("Neural link unstable. Check your connection.");
      setMessages(prev => [...prev, { role: 'assistant', content: "My communication frequencies are jammed. Please re-engage in a moment or verify the system API configurations." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.div
        className="fixed bottom-24 left-4 md:left-8 z-[100]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="glow"
          size="icon"
          className={cn(
            "w-12 h-12 md:w-14 md:h-14 rounded-full shadow-2xl relative transition-all duration-500",
            isOpen ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-destructive/20" : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20"
          )}
        >
          {isOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <Bot className="w-5 h-5 md:w-6 md:h-6" />}
          {!isOpen && tokensLeft > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-background shadow-lg">
              {tokensLeft}
            </span>
          )}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            className="fixed bottom-40 left-4 md:left-8 right-4 md:right-auto z-[100] md:w-[380px] h-[450px] md:h-[500px] glass-card rounded-[2rem] md:rounded-[2.5rem] border-border shadow-2xl flex flex-col overflow-hidden bg-card/95 backdrop-blur-2xl transition-all duration-500"
          >
            {/* Header */}
            <div className="p-6 border-b border-border bg-primary/5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 shadow-inner">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground">ELYSIUM</h3>
                  <p className="text-[10px] text-muted-foreground font-bold tracking-tighter">{tokensLeft} Queries Remaining</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase text-green-600">Active</span>
              </div>
            </div>

            {/* Warning about plagiarism */}
            <div className="px-6 py-2 bg-primary/5 border-b border-border flex flex-col gap-1 italic">
              <span className="text-[9px] font-bold text-primary/80 uppercase tracking-widest leading-none">If you are going wrong and need help, ask me.</span>
            </div>

            <div className="px-6 py-2 bg-amber-500/5 border-b border-border flex items-center gap-2 italic">
              <AlertCircle className="w-3 h-3 text-amber-500" />
              <span className="text-[8px] font-bold text-amber-600 uppercase tracking-widest leading-none">Warning: Plagiarism deducts stipend money!</span>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-6" ref={scrollRef}>
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-[2rem] bg-muted flex items-center justify-center mx-auto shadow-inner border border-border">
                      <MessageSquare className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium px-8 leading-relaxed italic opacity-60">
                      "I am ELYSIUM, your strategic guide. How shall we optimize your career trajectory today?"
                    </p>
                  </div>
                )}
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex flex-col gap-1 max-w-[85%]",
                      m.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div className={cn(
                      "px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm transition-all",
                      m.role === 'user'
                        ? "bg-primary text-primary-foreground rounded-tr-none shadow-primary/10"
                        : "bg-muted text-foreground rounded-tl-none border border-border shadow-inner"
                    )}>
                      {m.content}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex gap-2 items-center text-[10px] font-black uppercase tracking-widest text-primary ml-2 italic">
                    <div className="w-1 h-1 rounded-full bg-primary animate-bounce" />
                    <div className="w-1 h-1 rounded-full bg-primary animate-bounce delay-75" />
                    <div className="w-1 h-1 rounded-full bg-primary animate-bounce delay-150" />
                    Calculating...
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-6 border-t border-border bg-muted/30">
              <div className="relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask ELYSIUM for help..."
                  className="bg-card border-border pr-12 h-12 rounded-2xl text-xs placeholder:text-muted-foreground focus:ring-primary/20 shadow-inner text-foreground font-medium"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleSend}
                  disabled={isLoading || !input.trim() || tokensLeft <= 0}
                  className="absolute right-1 top-1 w-10 h-10 rounded-xl hover:bg-primary/10 text-primary transition-all disabled:opacity-30"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[8px] text-center mt-3 text-muted-foreground font-black uppercase tracking-[0.2em] opacity-60">
                1 Credit per query • Global Balance: {tokensLeft}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

