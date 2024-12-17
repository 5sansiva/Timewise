// Name: Venkat Sai Eshwar Varma Sagi (VXS210103)

// Import necessary modules and hooks
import React, { useState, useRef, useEffect } from 'react';

// Interface defining the structure of a chat message
interface ChatMessage {
  type: 'user' | 'assistant' | 'error' | 'success';
  content: string;
}

// Props interface defining the structure of event handling functions
interface ChatInterfaceProps {
  onEventCreate: (event: {
    id: string | number;
    title: string;
    start_time: string;
    end_time: string;
    all_day: boolean;
  }) => void;
  onEventDelete?: (response: { message: string }) => void;
}

// Main ChatInterface component
const ChatInterface: React.FC<ChatInterfaceProps> = ({ onEventCreate, onEventDelete }) => {
  // State to manage the current user input
  const [input, setInput] = useState<string>('');
  
  // State to hold the history of chat messages
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  
  // State to indicate if a request is in progress
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Reference for the chat history container to handle scrolling
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  // Effect to auto-scroll to the bottom of chat history when it updates
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Function to handle sending a message
  const handleSend = async () => {
    // Ignore if input is empty
    if (!input.trim()) return;

    // Create a message object from user input
    const userMessage: ChatMessage = { type: 'user', content: input };
    
    // Add user message to chat history and reset input
    setChatHistory(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true); // Set loading to true while processing

    try {
      // Send the input message to the server API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      // Parse the response from the server
      const data = await response.json();

      // Handle different response statuses from the server
      if (data.status === 'error') {
        setChatHistory(prev => [
          ...prev,
          { type: 'error', content: data.response || 'An error occurred while processing your request.' }
        ]);
        return;
      }

      if (data.status === 'not_found') {
        setChatHistory(prev => [
          ...prev,
          { type: 'error', content: data.response }
        ]);
        return;
      }

      // Create a success message from the assistant's response
      const assistantMessage: ChatMessage = { 
        type: 'success', 
        content: data.response 
      };
      
      // Add assistant message to chat history
      setChatHistory(prev => [...prev, assistantMessage]);

      // Trigger event creation or deletion based on response data
      if (data.event) {
        onEventCreate(data.event);
      } else if (data.status === 'success' && data.response.includes('Removed')) {
        onEventDelete?.({ message: data.response });
      }

    } catch (error) {
      // Handle errors during fetch
      console.error('Error processing message:', error);
      setChatHistory(prev => [
        ...prev,
        { 
          type: 'error', 
          content: 'There was an error communicating with the calendar assistant.' 
        }
      ]);
    } finally {
      // Reset loading state once message processing is complete
      setIsLoading(false);
    }
  };

  // Render the chat interface UI
  return (
    <div className="chat-interface">
      {/* Header section for the chat */}
      <div className="chat-header">
        Calendar Assistant
      </div>

      {/* Chat history container */}
      <div className="chat-history" ref={chatHistoryRef}>
        {/* Initial welcome message if no messages in chat history */}
        {chatHistory.length === 0 ? (
          <div className="welcome-message">
            Hello! I can help you manage your calendar. Try commands like:
            <ul>
              <li>"Schedule a doctor's appointment tomorrow at 10am"</li>
              <li>"What's on my calendar today?"</li>
              <li>"Delete the meeting scheduled for next week"</li>
            </ul>
          </div>
        ) : (
          // Map over chat history and render each message
          chatHistory.map((msg, idx) => (
            <div key={idx} className={`message ${msg.type}`}>
              <span className="message-prefix">
                {msg.type === 'user' ? '👤 You: ' : '🤖 Assistant: '}
              </span>
              {msg.content}
            </div>
          ))
        )}

        {/* Loading indicator displayed when processing a message */}
        {isLoading && (
          <div className="loading-indicator">
            <span>Thinking</span>
            <span className="dots">...</span>
          </div>
        )}
      </div>

      {/* Input section for typing and sending messages */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your calendar command..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
          disabled={isLoading} // Disable input when loading
        />
        
        {/* Button to send messages */}
        <button 
          onClick={handleSend} 
          disabled={isLoading || !input.trim()}
          className={isLoading ? 'loading' : ''}
        >
          {isLoading ? 'Processing...' : 'Send'}
        </button>
      </div>

      {/* Styles for the chat interface */}
      <style jsx>{`
        .chat-interface {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background-color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          height: 500px;
        }

        .chat-header {
          padding: 1rem;
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          font-weight: 600;
          border-radius: 8px 8px 0 0;
        }

        .chat-history {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          background-color: #ffffff;
        }

        .welcome-message {
          color: #64748b;
          padding: 1rem;
          background-color: #f8fafc;
          border-radius: 6px;
        }

        .welcome-message ul {
          margin-top: 0.5rem;
          margin-left: 1.5rem;
        }

        .welcome-message li {
          margin: 0.25rem 0;
          color: #0369a1;
        }

        .message {
          margin: 0.5rem 0;
          padding: 0.75rem;
          border-radius: 6px;
          max-width: 80%;
        }

        .message.user {
          background-color: #e0f2fe;
          margin-left: auto;
          color: #0c4a6e;
        }

        .message.assistant, .message.success {
          background-color: #f0fdf4;
          color: #166534;
        }

        .message.error {
          background-color: #fef2f2;
          color: #991b1b;
        }

        .message-prefix {
          font-weight: 600;
          margin-right: 0.5rem;
        }

        .loading-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          color: #64748b;
        }

        .dots {
          animation: dots 1.5s infinite;
        }

        .chat-input {
          display: flex;
          padding: 1rem;
          background-color: #f8fafc;
          border-top: 1px solid #e2e8f0;
          border-radius: 0 0 8px 8px;
        }

        input[type="text"] {
          flex: 1;
          padding: 0.75rem;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          margin-right: 0.5rem;
          font-size: 0.95rem;
        }

        input[type="text"]:disabled {
          background-color: #f1f5f9;
        }

        button {
          padding: 0.75rem 1.5rem;
          background-color: #0284c7;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        button:hover:not(:disabled) {
          background-color: #0369a1;
        }

        button:disabled {
          background-color: #94a3b8;
          cursor: not-allowed;
        }

        button.loading {
          background-color: #94a3b8;
        }

        @keyframes dots {
          0%, 20% { content: '.'; }
          40% { content: '..'; }
          60% { content: '...'; }
          80%, 100% { content: ''; }
        }
      `}</style>
    </div>
  );
};

// Export the ChatInterface component as default
export default ChatInterface;
