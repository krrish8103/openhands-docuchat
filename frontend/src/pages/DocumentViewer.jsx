








import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DocumentViewer = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('content');
  const [query, setQuery] = useState('');
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:8000'}/documents/${id}`);
      setDocument(res.data);
      setSuggestedQuestions([
        'What is the main topic of this document?',
        'Can you summarize the key points?',
        'What are the main conclusions?',
        'Are there any important dates mentioned?',
        'Can you explain the most complex section?'
      ]);
    } catch (err) {
      setError('Failed to load document');
      console.error('Error loading document:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAskQuestion = () => {
    if (query.trim()) {
      // Start a new conversation with this document
      navigate(`/chat/new?documentId=${id}&question=${encodeURIComponent(query)}`);
    }
  };

  const handleSuggestedQuestion = (question) => {
    setQuery(question);
    handleAskQuestion();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button
            onClick={fetchDocument}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{document.title}</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate(`/chat/new?documentId=${id}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Start New Chat
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => handleTabChange('content')}
              className={`px-4 py-2 ${activeTab === 'content' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'} focus:outline-none transition duration-200`}
            >
              Document Content
            </button>
            <button
              onClick={() => handleTabChange('metadata')}
              className={`px-4 py-2 ${activeTab === 'metadata' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'} focus:outline-none transition duration-200`}
            >
              Metadata
            </button>
          </div>

          <div className="mt-6">
            {activeTab === 'content' ? (
              <div>
                <p className="text-gray-700">{document.content}</p>
              </div>
            ) : (
              <div>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                  {Object.entries((() => {
                    const md = document.document_metadata ?? {};
                    if (typeof md === 'string') {
                      try { return JSON.parse(md); } catch { return {}; }
                    }
                    return md;
                  })()).map(([key, value]) => (
                    <div key={key} className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">{key.charAt(0).toUpperCase() + key.slice(1)}</dt>
                      <dd className="mt-1 text-sm text-gray-900">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Ask a Question</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type your question here..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleAskQuestion}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Ask DocuChatPro
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Suggested Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="bg-gray-100 text-gray-800 px-4 py-3 rounded-md hover:bg-gray-200 transition duration-200 text-left"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;






