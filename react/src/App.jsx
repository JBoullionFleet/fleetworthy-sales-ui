import React, { useState } from 'react';
import AgentInteraction from './components/AgentInteraction';
import ContactInfo from './components/ContactInfo';
import ContactForm from './components/ContactForm';

// Main App component
function App() {
    // State for chat log messages (managed globally in App.jsx as it's shared)
    const [chatLog, setChatLog] = useState([{ sender: 'ai', message: "Welcome! I'm your Fleetworthy AI Sales Agent. How can I help you today?" }]);
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator (also global)

    // Utility function to add messages to the chat log (passed to AgentInteraction)
    const addMessageToChatLog = (message, sender) => {
        setChatLog((prevChatLog) => [...prevChatLog, { message, sender }]);
    };

    return (
        <div className="w-full max-w-6xl mx-auto bg-base-100 rounded-xl shadow-lg p-8">
            {/* Page Title and Description */}
            <h1 className="text-4xl font-extrabold text-center text-base-content mb-4">How can Fleetworthy Help your Business?</h1>
            <p className="text-xl text-center text-base-content mb-8">Ask our AI Sales Agent!</p>

            {/* Main Content Area: Two Columns (8/4 ratio) */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column: AI Agent Application */}
                <AgentInteraction
                    chatLog={chatLog}
                    addMessageToChatLog={addMessageToChatLog}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                />

                {/* Right Column: Contact Information & Form */}
                <div className="w-full md:w-4/12 space-y-6 bg-gray-50 p-6 rounded-lg shadow-md">
                    <ContactInfo />
                    <ContactForm />
                </div>
            </div>
        </div>
    );
}

export default App;
