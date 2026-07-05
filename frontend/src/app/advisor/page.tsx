"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageSquare } from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";
import ChatBubble, { TypingIndicator } from "@/components/chat-bubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/hooks/use-user";
import { api } from "@/lib/api";
import type { ChatMessage } from "@/types";

export default function AdvisorPage() {
  const router = useRouter();
  const { user, isOnboarded } = useUser();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Redirect if not onboarded
  useEffect(() => {
    if (!isOnboarded) {
      router.replace("/assessment");
    }
  }, [isOnboarded, router]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOnboarded && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: `Hi ${user.name}! I'm your AI Career Advisor. I can help you with career decisions, skill recommendations, certification advice, and more. What would you like to know about your path to becoming a ${user.career_goal}?`,
        },
      ]);
    }
  }, [isOnboarded, user.name, user.career_goal, messages.length]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMessage: ChatMessage = { role: "user", content: trimmed };
      const updatedMessages = [...messages, userMessage];

      setMessages(updatedMessages);
      setInput("");
      setLoading(true);
      setSuggestions([]);

      try {
        const response = await api.chat({
          user_id: user.user_id!,
          message: trimmed,
          history: updatedMessages,
        });

        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: response.response,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setSuggestions(response.suggestions || []);
      } catch {
        const errorMessage: ChatMessage = {
          role: "assistant",
          content:
            "I'm sorry, I encountered an error processing your request. Please try again.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [loading, messages, user.user_id]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (!isOnboarded) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-shrink-0 mb-6"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20">
              <MessageSquare className="h-6 w-6 text-indigo-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              AI Career Advisor
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-2 ml-14">
            Your personal AI assistant for career guidance and planning
          </p>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden min-h-0"
        >
          {/* Messages Area */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 md:p-6 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChatBubble message={message} />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <TypingIndicator />
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Suggestion Chips */}
          <AnimatePresence>
            {suggestions.length > 0 && !loading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex-shrink-0 px-4 md:px-6 pb-3 border-t border-white/5 pt-3"
              >
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">
                  Suggested questions
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-all duration-200 cursor-pointer"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Area */}
          <div className="flex-shrink-0 p-4 md:px-6 md:py-4 border-t border-white/10">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your career path..."
                disabled={loading}
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500/50 h-11"
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                className="h-11 px-5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white border-0 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
