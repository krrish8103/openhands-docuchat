







import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [newConversationTitle, setNewConversationTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:8000'}/documents/`);
      setDocuments(res.data || []);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentClick = (documentId) => {
    navigate(`/documents/${documentId}`);
  };

  const handleNewConversation = () => {
    // Create a new conversation
    navigate('/chat/new');
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
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
            <button
              onClick={handleNewConversation}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              New Conversation
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading documents...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-600">No documents found. Upload a document to get started.</p>
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleDocumentClick(doc.id)}
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition duration-200"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-12 w-12 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012 3H7a2 2 0 00-2 2v16a2 2 0 002 2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 13a1 1 0 100-2 1 1 0 000 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">{doc.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{doc.file_type.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;





