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
                       {/* Company Website URL Input */}
            <div className="form-control">
                <label htmlFor="companyWebsiteUrl" className="label text-base-content">
                    <span className="label-text">Company Website URL:</span>
                </label>
                <input
                    type="url"
                    id="companyWebsiteUrl"
                    name="companyWebsiteUrl"
                    placeholder="e.g., https://www.yourcompany.com"
                    className="input input-bordered w-full" // DaisyUI input class
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                />
            </div>

            {/* About Company Text Area */}
            <div className="form-control">
                <label htmlFor="aboutCompany" className="label text-base-content">
                    <span className="label-text">About Your Company (Operations, Challenges, Goals):</span>
                </label>
                <textarea
                    id="aboutCompany"
                    name="aboutCompany"
                    rows="6"
                    placeholder="Provide details about your trucking operations, current challenges, and what you hope to achieve with new software."
                    className="textarea textarea-bordered h-auto resize-y w-full" // DaisyUI textarea class
                    value={aboutCompany}
                    onChange={(e) => setAboutCompany(e.target.value)}
                ></textarea>
            </div>

            {/* File Upload Section */}
            <div className="form-control">
                <label htmlFor="companyFile" className="label text-base-content">
                    <span className="label-text">Upload Company Document (PDF, TXT, etc.):</span>
                </label>
                <input
                    type="file"
                    id="companyFile"
                    name="companyFile"
                    accept=".pdf,.txt,.doc,.docx"
                    className="file-input file-input-bordered w-full" // DaisyUI file-input class
                    onChange={(e) => setCompanyFile(e.target.files[0])}
                />
                <label className="label">
                    <span className="label-text-alt">Max file size: 5MB. Supported formats: PDF, TXT, DOC, DOCX.</span>
                </label>
            </div>

             {/* Question Section */}
             <div className="form-control"> {/* DaisyUI form-control for input groups */}
                <label htmlFor="questionInput" className="label text-base-content">
                    <span className="label-text">Your Question:</span>
                </label>
                <div className="flex gap-3">
                    <input
                        type="text"
                        id="questionInput"
                        name="questionInput"
                        required
                        placeholder="e.g., How can Fleetworthy help reduce my fuel costs?"
                        className="input input-bordered w-full flex-grow" // DaisyUI input class
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyPress={(e) => { if (e.key === 'Enter') handleAsk(); }}
                    />
                    <button type="button" id="askButton" className="btn btn-primary" onClick={handleAsk}> {/* DaisyUI btn and btn-error */}
                        Ask
                    </button>
                </div>
            </div>

            {/* Chat Log Area */}
            <div>
                <h3 className="text-xl font-semibold text-base-content mb-2">Chat Log:</h3>
                <div ref={chatLogRef} id="chat-log-area" className={`min-h-[300px] p-4 bg-gray-50 border border-gray-200 rounded-md shadow-inner overflow-y-auto flex flex-col space-y-3 ${isLoading ? 'loading' : ''}`}>
                    {/* Display loading spinner/message when isLoading is true */}
                    {isLoading && (
                        <div className="flex justify-center items-center h-full">
                            <span className="loading loading-spinner text-primary"></span> {/* DaisyUI loading spinner */}
                            <p className="ml-2 text-gray-600">AI Agent is thinking...</p>
                        </div>
                    )}
                    {chatLog.map((msg, index) => (
                        // DaisyUI chat-bubble for messages
                        <div key={index} className={`chat ${msg.sender === 'user' ? 'chat-end' : 'chat-start'}`}>
                            <div className={`chat-bubble ${msg.sender === 'user' ? 'chat-bubble-info' : 'chat-bubble-neutral'}`}>
                                {msg.message}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AgentInteraction;
