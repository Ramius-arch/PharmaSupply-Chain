import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ChatBot.css';

// ─── PharmaSupply Knowledge Base ─────────────────────────────────────────────
const KB = [
  {
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy'],
    response: "Hello! 👋 I'm Quri, your PharmaSupply assistant. I can help you understand our blockchain-powered supply chain or navigate the platform. What's on your mind?",
  },
  {
    patterns: ['blockchain', 'why blockchain', 'benefit', 'ledger', 'immutable', 'trust'],
    response: "PharmaSupply uses **Ethereum/Hardhat** blockchain to create an immutable record of every product's journey. This ensures:\n\n✅ **Transparency:** Anyone can verify a batch's origin.\n✅ **Traceability:** Sub-second tracking of movements.\n✅ **Security:** Cryptographic signatures prevent data tampering.\n\nWant to see the transactions? Check the **Blockchain History** in your dashboard!",
  },
  {
    patterns: ['track', 'where is my', 'status', 'batch', 'movement', 'history'],
    response: "You can track any product by clicking **'Audit Details'** on its card. For a full list of system movements, visit the **Transaction History** page. Every scan and transfer is logged on-chain in real-time.",
  },
  {
    patterns: ['manufacturer', 'distributor', 'pharmacy', 'role', 'supplier'],
    response: "PharmaSupply connects three main stakeholders:\n\n🏭 **Manufacturers:** Create and sign the initial product batch.\n🚚 **Distributors:** Log transport and storage conditions.\n🏥 **Pharmacies:** Verify integrity before dispensing to patients.\n\nEach role has specific permissions secured by their private keys.",
  },
  {
    patterns: ['wallet', 'private key', 'generate', 'sign', 'transaction'],
    response: "To interact with the blockchain, you need a digital signature. You can use the **'Generate Wallet'** feature to create a temporary PoC key. In production, this would be managed via secure hardware or MetaMask.",
  },
  {
    patterns: ['product', 'medicine', 'drug', 'inventory', 'catalog'],
    response: "Our **Verified Inventory** showcases products currently tracked by the system. Each entry is backed by a blockchain record. Explore them in the **Products** section!",
  },
  {
    patterns: ['contact', 'support', 'help', 'team', 'email', 'whatsapp'],
    response: "You can reach the PharmaSupply team via:\n\n📧 **Email:** quixora2@gmail.com\n💬 **WhatsApp:** +254 799 390 564\n\nOr use the contact form at the bottom of the home page!",
  },
  {
    patterns: ['thank', 'thanks', 'helpful', 'great'],
    response: "You're very welcome! I'm here to ensure your supply chain remains transparent. Any other questions?",
  },
  {
    patterns: ['bye', 'goodbye', 'see you'],
    response: "Goodbye! 👋 Stay secure and transparent. Feel free to return if you need more help.",
  },
];

const SUGGESTIONS = [
  "How does blockchain help?",
  "How do I track a product?",
  "What are the user roles?",
  "How to generate a wallet?",
];

function getResponse(input) {
  const lower = input.toLowerCase();
  for (const item of KB) {
    if (item.patterns.some((p) => lower.includes(p))) {
      return { text: item.response, whatsapp: item.whatsapp };
    }
  }
  return { 
    text: "I'm not sure I understand that yet. 🤖 I'm specifically trained on PharmaSupply's blockchain logic. Try asking about 'tracking', 'blockchain benefits', or 'user roles'!",
    whatsapp: false 
  };
}

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: "Welcome to PharmaSupply! 🛡️ I'm Quri. How can I assist you with your supply chain audit today?" }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const msgEndRef = useRef(null);

  const scrollToBottom = () => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    
    const userMsg = { id: Date.now(), from: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const resp = getResponse(text);
      const botMsg = { id: Date.now() + 1, from: 'bot', ...resp };
      setMessages(prev => [...prev, botMsg]);
      setTyping(false);
    }, 1000);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="chatbot-avatar">P</div>
                <div>
                  <div className="chatbot-name">Quri</div>
                  <div className="chatbot-status">
                    <span className="chatbot-dot" />
                    Online — Pharma Audit Assistant
                  </div>
                </div>
              </div>
              <button className="chatbot-close" onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="chatbot-messages">
              {messages.map((m) => (
                <div key={m.id} className={`chatbot-msg chatbot-msg--${m.from}`}>
                  <div className="chatbot-bubble">
                    <div dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    {m.whatsapp && (
                      <a href="https://wa.me/254799390564" target="_blank" rel="noopener noreferrer" className="chatbot-wa-btn">
                        Chat on WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="chatbot-msg chatbot-msg--bot">
                  <div className="chatbot-bubble chatbot-typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={msgEndRef} />
              
              {!typing && messages[messages.length-1].from === 'bot' && (
                <div className="chatbot-suggestions">
                  {SUGGESTIONS.map(s => (
                    <button key={s} className="chatbot-suggestion" onClick={() => sendMessage(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="chatbot-input-area">
              <input
                type="text"
                className="chatbot-input"
                placeholder="Ask about integrity..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
              />
              <button className="chatbot-send" onClick={() => sendMessage(input)}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button className="chatbot-fab" onClick={() => setOpen(!open)}>
        {open ? '✕' : '💬'}
        {!open && <span className="chatbot-fab-pulse" />}
      </button>
    </>
  );
};

export default ChatBot;
