"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles, Smartphone, ShieldCheck, BadgePercent } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/stores";
import { useToastStore } from "./Toast";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Szia! Én vagyok a Phonix AI asszisztense. Miben segíthetek ma? Kérdezhetsz a telefonok árairól, kamerájáról vagy kérhetsz ajánlást is!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsLoading] = useState(false);
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const quickQuestions = [
    { label: "Melyik a legjobb kamera?", query: "Melyik telefonnak van a legjobb kamerája?" },
    { label: "Ajánlj telefont $800 alatt", query: "Ajánlj nekem egy telefont 800 dollár alatt!" },
    { label: "iPhone 15 Pro Max ára?", query: "Mennyibe kerül az iPhone 15 Pro Max?" },
  ];

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const newUserMessage: Message = {
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response with custom rule matching
    setTimeout(() => {
      const query = textToSend.toLowerCase();
      let reply = "";

      // Hungarian and English keyword matching
      if (query.includes("kamera") || query.includes("camera") || query.includes("fotó")) {
        reply = "A legjobb kamerarendszerrel a **Samsung Galaxy S24 Ultra** (200MP fő szenzor) és az **iPhone 15 Pro Max** (5x optikai zoom és Apple ProRAW) rendelkezik. Ha professzionális fotózásra keresel telefont, ezt a kettőt ajánlom leginkább!";
      } else if (query.includes("800") || query.includes("olcsó") || query.includes("cheap") || query.includes("budget")) {
        const affordable = PRODUCTS.filter((p) => p.price <= 800);
        const list = affordable.map((p) => `· **${p.name}** (${formatPrice(p.price)})`).join("\n");
        reply = `A következő kiváló telefonokat ajánlom $800 alatt:\n\n${list}\n\nKülönösen a **OnePlus 12**-t ajánlom, ami elképesztő teljesítményt nyújt ezen az áron!`;
      } else if (query.includes("iphone 15 pro max") || query.includes("15 pro max")) {
        const phone = PRODUCTS.find((p) => p.id === "iphone-15-pro-max");
        if (phone) {
          reply = `Az **iPhone 15 Pro Max** jelenleg akciósan **${formatPrice(phone.price)}** (eredeti ár: ${formatPrice(phone.originalPrice)}). Titán házzal, A17 Pro chippel és kiváló 5x-ös zoom kamerával rendelkezik. Szeretnéd, hogy kosárba tegyem?`;
        }
      } else if (query.includes("s24 ultra") || query.includes("galaxy s24")) {
        const phone = PRODUCTS.find((p) => p.id === "galaxy-s24-ultra");
        if (phone) {
          reply = `A **Samsung Galaxy S24 Ultra** ára **${formatPrice(phone.price)}**. Ez a telefon beépített S-Pennel és a legújabb Galaxy AI funkciókkal (élő fordítás, intelligens képszerkesztés) van felszerelve. Kiváló választás!`;
        }
      } else if (query.includes("kosár") || query.includes("add") || query.includes("megvesz") || query.includes("buy")) {
        // Add first featured phone to cart as action
        const phone = PRODUCTS[0];
        addItem(phone, phone.colors[0], phone.storage[0]);
        addToast(`Kosárba téve: ${phone.name}!`, "success");
        reply = `Szuper! Sikeresen kosárba tettem egy **${phone.name}** készüléket (${phone.storage[0]}, ${phone.colors[0]} színben). A kosár oldalon tudod ellenőrizni!`;
      } else if (query.includes("szia") || query.includes("hello") || query.includes("hey")) {
        reply = "Szia! Miben segíthetek ma a Phonix telefonboltban? Kérdezz bátran a legújabb modellekről!";
      } else {
        reply = "Köszönöm a kérdést! Jelenleg az Apple, Samsung, Google és OnePlus legújabb zászlóshajóit forgalmazzuk. Ha konkrét specifikációra (akkumulátor, képernyő, processzor) vagy árakra vagy kíváncsi, írd meg a modell nevét!";
      }

      const newAiMessage: Message = {
        sender: "ai",
        text: reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newAiMessage]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Floating Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary/95 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-2 border border-white/10 group"
          aria-label="Open AI Assistant"
        >
          <MessageSquare className="w-6 h-6 animate-pulse group-hover:scale-110 transition-transform" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold text-xs uppercase tracking-wider whitespace-nowrap">
            AI Asszisztens
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-card border rounded-2xl shadow-2xl w-[360px] sm:w-[380px] h-[500px] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="bg-primary/20 p-1.5 rounded-lg text-primary">
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight">Phonix AI Segéd</h3>
                <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Online · Kész segíteni
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-sm font-semibold whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-card border text-foreground rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-card border p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="p-2 bg-muted/20 border-t flex gap-1.5 overflow-x-auto shrink-0">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q.query)}
                className="text-[10px] font-bold bg-card hover:bg-muted border px-2.5 py-1.5 rounded-lg shrink-0 transition-colors text-muted-foreground hover:text-foreground"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t bg-card flex gap-2 shrink-0">
            <input
              type="text"
              placeholder="Írj egy üzenetet..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              className="flex-grow bg-background border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
            />
            <button
              onClick={() => handleSend(input)}
              className="bg-primary text-white p-2.5 rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/10 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
