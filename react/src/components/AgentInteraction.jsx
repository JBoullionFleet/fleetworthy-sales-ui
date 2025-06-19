import React, { useState, useEffect, useRef } from 'react';

// AgentInteraction Component: Handles user inputs for AI interaction and displays chat log
function AgentInteraction({ chatLog, addMessageToChatLog, isLoading, setIsLoading }) {
    // Local state for input fields
    const [question, setQuestion] = useState('');
    const [companyWebsite, setCompanyWebsite] = useState('');
    const [aboutCompany, setAboutCompany] = useState('');
    const [companyFile, setCompanyFile] = useState(null); // State for the selected file

    // Ref for auto-scrolling chat log
    const chatLogRef = useRef(null);

    // Effect to scroll to bottom of chat log when new messages arrive or loading state changes
    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, [chatLog, isLoading]);

    // Event handler for the "Ask" button
    const handleAsk = async () => {
        if (!question.trim()) {
            addMessageToChatLog("Please enter a question to ask the AI Sales Agent.", "ai");
            return;
        }

        // Add user's question to chat log
        addMessageToChatLog(question, 'user');

        // Clear the question input after sending
        setQuestion('');
        setIsLoading(true); // Show loading indicator

        // Prepare data to send to backend
        const payload = {
            question: question.trim(),
            company_website: companyWebsite.trim(),
            company_description: aboutCompany.trim(),
            file_attached: companyFile ? true : false,
            file_name: companyFile ? companyFile.name : null,
            file_type: companyFile ? companyFile.type : null,
            // Future: file_data: companyFile ? await readFileAsBase64(companyFile) : null
        };

        try {
            // IMPORTANT: Use your Render.com backend URL
            // For now, still hitting /hello endpoint with just 'name' for testing UI structure.
            // We'll update backend logic to handle full payload in a later step.
            const backendApiUrl = 'https://fleetworthy-sales-api.onrender.com/hello';

            const response = await fetch(backendApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: payload.question }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            addMessageToChatLog(data.message || 'No response from AI agent.', 'ai');

        } catch (error) {
            console.error('Error communicating with AI agent:', error);
            addMessageToChatLog('Oops! There was an error getting a response from the AI. Please try again.', 'ai');
        } finally {
            setIsLoading(false); // Hide loading indicator
        }
    };

    return (
        <div className="w-full md:w-8/12 space-y-6">
            {/* Question Section */}
            <div>
                <label htmlFor="questionInput" className="block text-sm font-medium text-gray-700 mb-1">Your Question:</label>
                <div className="flex gap-3">
                    <input
                        type="text"
                        id="questionInput"
                        name="questionInput"
                        required
                        placeholder="e.g., How can Fleetworthy help reduce my fuel costs?"
                        className="form-input flex-grow"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyPress={(e) => { if (e.key === 'Enter') handleAsk(); }}
                    />
                    <button type="button" id="askButton" className="ask-button" onClick={handleAsk}>Ask</button>
                </div>
            </div>

            {/* Company Website URL Input */}
            <div>
                <label htmlFor="companyWebsiteUrl" className="block text-sm font-medium text-gray-700 mb-1">Company Website URL:</label>
                <input
                    type="url"
                    id="companyWebsiteUrl"
                    name="companyWebsiteUrl"
                    placeholder="e.g., https://www.yourcompany.com"
                    className="form-input"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                />
            </div>

            {/* About Company Text Area */}
            <div>
                <label htmlFor="aboutCompany" className="block text-sm font-medium text-gray-700 mb-1">About Your Company (Operations, Challenges, Goals):</label>
                <textarea
                    id="aboutCompany"
                    name="aboutCompany"
                    rows="6"
                    placeholder="Provide details about your trucking operations, current challenges, and what you hope to achieve with new software."
                    className="form-input resize-y"
                    value={aboutCompany}
                    onChange={(e) => setAboutCompany(e.target.value)}
                ></textarea>
            </div>

            {/* File Upload Section */}
            <div>
                <label htmlFor="companyFile" className="block text-sm font-medium text-gray-700 mb-1">Upload Company Document (PDF, TXT, etc.):</label>
                <input
                    type="file"
                    id="companyFile"
                    name="companyFile"
                    accept=".pdf,.txt,.doc,.docx"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    onChange={(e) => setCompanyFile(e.target.files[0])}
                />
                <p className="mt-1 text-xs text-gray-500">Max file size: 5MB. Supported formats: PDF, TXT, DOC, DOCX.</p>
            </div>

            {/* Chat Log Area */}
            <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Chat Log:</h3>
                <div ref={chatLogRef} id="chat-log-area" className={`min-h-[300px] p-4 bg-gray-50 border border-gray-200 rounded-md shadow-inner overflow-y-auto flex flex-col items-start space-y-3 ${isLoading ? 'loading' : ''}`}>
                    {chatLog.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.sender}`}>
                            {msg.message}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AgentInteraction;
