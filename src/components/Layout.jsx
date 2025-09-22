import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import ChatWidget from './ChatWidget.jsx';

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors z-50"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
      
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50">
          <ChatWidget />
        </div>
      )}
    </>
  );
}