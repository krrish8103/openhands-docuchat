









import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChatPage = () => {
  const { conversationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [document, setDocument] = useState(null);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const documentId = params.get('documentId');
    const initialQuestion = params.get('question');

    if (documentId) {
      fetchDocument(documentId);
    }

    if (initialQuestion) {
      setInput(initialQuestion);
      handleSendMessage(initialQuestion);
    } else {
      fetchConversation();
    }
  }, [conversationId, location.search]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchDocument = async (documentId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:8000'}/documents/${documentId}`);
      setDocument(res.data);
    } catch (err) {
      console.error('Error loading document:', err);
    }
  };

  const fetchConversation = async () => {
    if (!conversationId) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:8000'}/chat/conversations/${conversationId}`);
      // We don't have messages listing in backend; leave messages empty for now
      setMessages([]);
    } catch (err) {
      setError('Failed to load conversation');
      console.error('Error loading conversation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (messageContent = input) => {
    if (!messageContent.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'user',
      content: messageContent,
      timestamp: new Date().toISOString()
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
      const convId = conversationId === 'new' ? null : conversationId;
      let currentConvId = convId;
      if (!currentConvId) {
        // Create conversation if not exists (when starting from document)
        const params = new URLSearchParams(location.search);
        const docId = params.get('documentId');
        const convRes = await axios.post(`${apiBase}/chat/conversations`, { title: 'New Conversation', document_id: docId ? parseInt(docId) : null });
        currentConvId = convRes.data.id;
        // navigate to persistent route
        navigate(`/chat/${currentConvId}`, { replace: true });
      }
      await axios.post(`${apiBase}/chat/conversations/${currentConvId}/messages`, { sender: 'user', content: messageContent });
      // Trigger AI reply via backend convenience: send with sender='ai' to get generated content
      const aiRes = await axios.post(`${apiBase}/chat/conversations/${currentConvId}/messages`, { sender: 'ai', content: messageContent });
      setMessages(prevMessages => [...prevMessages, { id: Date.now() + 1, sender: 'ai', content: aiRes.data.content, timestamp: new Date().toISOString() }]);
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBack = () => {
    if (document) {
      navigate(`/documents/${document.id}`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800 transition duration-200 mr-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            {document ? `Chat with ${document.title}` : 'New Conversation'}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {document && (
            <div className="flex items-center">
              <span className="mr-2">AI Model:</span>
              <select
                value={selectedModel}
                onChange={handleModelChange}
                className="border rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="gpt-4o-mini">GPT-4o Mini</option>
                <option value="deepseek-r1">DeepSeek R1</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>Start a conversation by asking a question about the document.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xl p-4 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} shadow`}
              >
                <p>{message.content}</p>
                <span className="block text-xs text-gray-400 mt-2">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 p-4 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        )}
        {error && (
          <div className="text-red-500 text-center">
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white p-4 border-t border-gray-200">
        <div className="flex">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="1"
          ></textarea>
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className={`ml-2 px-6 py-3 rounded-r-md ${isLoading || !input.trim() ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'} transition duration-200`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;







