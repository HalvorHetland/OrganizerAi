
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { SendIcon, BotIcon, UserIcon, LoaderIcon } from './IconComponents';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isModel = message.role === 'model';
  return (
    <div className={`flex items-start gap-3 my-4 ${isModel ? '' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${isModel ? 'bg-blue-500' : 'bg-gray-600'}`}>
        {isModel ? <BotIcon className="h-6 w-6 text-white" /> : <UserIcon className="h-6 w-6 text-white" />}
      </div>
      <div
        className={`px-4 py-3 rounded-2xl max-w-lg ${
          isModel
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
            : 'bg-blue-600 text-white rounded-br-none'
        }`}
      >
        <p>{message.text}</p>
      </div>
    </div>
  );
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Chat Assistant</h2>
        <p className="text-gray-500 dark:text-gray-400">How can I help you organize your day?</p>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {messages.map((msg, index) => (
          msg.role !== 'tool' && <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && (
            <div className="flex items-start gap-3 my-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <BotIcon className="h-6 w-6 text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
                   <LoaderIcon className="h-6 w-6 text-blue-500" />
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me to add an assignment..."
            className="flex-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <SendIcon className="h-6 w-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
