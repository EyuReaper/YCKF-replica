'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { MessageCircle, Send, X, ChevronLeft } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ChatFloatingButtonProps {}

const ChatFloatingButton: React.FC<ChatFloatingButtonProps> = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const textClass = theme === 'light' ? 'text-gray-900' : 'text-white';
  const secondaryTextClass = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const bgClass = theme === 'light' ? 'bg-white shadow-lg' : 'bg-gray-900 shadow-lg';
  const buttonHoverClass = theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700';

  const handleChatClick = (channel: 'whatsapp' | 'telegram') => {
    // Optional: Track clicks via Google Analytics or send to backend
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'chat_click', { event_category: 'engagement', event_label: channel });
    }
    console.log(`Chat clicked: ${channel}`); // Placeholder for backend event
    setIsOpen(false); // Close after click
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed z-50 flex flex-col items-end space-y-2 bottom-6 right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`flex flex-col space-y-2 ${bgClass} rounded-lg p-4 border ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}
          >
            {/* WhatsApp Button */}
            <motion.a
              href="https://wa.me/YOUR_PHONE?text=Hi%20YCKF%20team!"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleChatClick('whatsapp')}
              className={`flex items-center gap-2 p-3 rounded-md ${theme === 'light' ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-green-600 text-white hover:bg-green-700'} transition-colors w-full justify-center`}
            >
              <MessageCircle size={20} />
              <span className="font-medium">WhatsApp</span>
            </motion.a>
            {/* Telegram Button */}
            <motion.a
              href="https://t.me/YOUR_BOT?start=faq_cybersecurity"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleChatClick('telegram')}
              className={`flex items-center gap-2 p-3 rounded-md ${theme === 'light' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-colors w-full justify-center`}
            >
              <Send size={20} />
              <span className="font-medium">Telegram</span>
            </motion.a>
            {/* Close Button */}
            <motion.button
              onClick={toggleChat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 p-3 rounded-md ${theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} transition-colors w-full justify-center`}
            >
              <ChevronLeft size={20} />
              <span className="font-medium">Close</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`p-4 rounded-full ${bgClass} ${buttonHoverClass} transition-all duration-200 shadow-xl border-2 border-green-500`}
        style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <MessageCircle size={24} className={`${secondaryTextClass}`} />
      </motion.button>
    </div>
  );
};

export default ChatFloatingButton;