
// Fix for SpeechRecognition API types not being available in default TypeScript lib
// This addresses:
// - "Cannot find name 'SpeechRecognition'"
// - "Property 'SpeechRecognition' does not exist on type 'Window'"
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: (() => void) | null;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { SendIcon, BotIcon, UserIcon, LoaderIcon, MicrophoneIcon, SpeakerIcon } from './IconComponents';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

interface ChatMessageProps {
  message: Message;
  onSpeak: (text: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSpeak }) => {
  const isModel = message.role === 'model';
  return (
    <div className={`flex items-end gap-2 my-4 group ${isModel ? '' : 'flex-row-reverse'}`}>
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
      {isModel && message.text && (
            <button 
                onClick={() => onSpeak(message.text)}
                className="p-1.5 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-500 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Read message aloud"
            >
                <SpeakerIcon className="h-5 w-5" />
            </button>
        )}
    </div>
  );
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAutoTTSOn, setIsAutoTTSOn] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const speak = (text: string) => {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);
  
  useEffect(() => {
    if (isAutoTTSOn && messages.length > 0 && !isLoading) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'model') {
        speak(lastMessage.text);
      }
    }
  }, [messages, isAutoTTSOn, isLoading]);

  useEffect(() => {
    // FIX: Remove (window as any) cast as types are now defined globally.
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setInput(finalTranscript + interimTranscript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn('Speech Recognition not supported in this browser.');
    }
    
    return () => {
        window.speechSynthesis?.cancel();
    }
  }, []);

  const handleListen = () => {
    if (isLoading || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setInput('');
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Chat Assistant</h2>
          <p className="text-gray-500 dark:text-gray-400">How can I help you organize your day?</p>
        </div>
        <button
            onClick={() => setIsAutoTTSOn(!isAutoTTSOn)}
            className={`p-2 rounded-full transition-colors ${
                isAutoTTSOn ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            aria-label={isAutoTTSOn ? 'Disable automatic speech' : 'Enable automatic speech'}
        >
            <SpeakerIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {messages.map((msg, index) => (
          msg.role !== 'tool' && <ChatMessage key={index} message={msg} onSpeak={speak} />
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
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 md:space-x-4">
          <button
            type="button"
            onClick={handleListen}
            disabled={isLoading || !recognitionRef.current}
            className={`p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                isListening ? 'text-red-500 animate-pulse' : 'text-gray-600 dark:text-gray-300'
            }`}
            aria-label="Use microphone"
          >
            <MicrophoneIcon className="h-6 w-6" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Ask me to add an assignment..."}
            className="flex-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
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