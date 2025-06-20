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

    // Helper function to convert file to base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Remove the data:type/subtype;base64, prefix
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    };

    // Event handler for the "Ask" button
    const handleAsk = async () => {
        if (!question.trim()) {
            addMessageToChatLog("Please enter a question to ask the AI Sales Agent.", "ai");
            return;
        }

        // Add user's question to chat log
        addMessageToChatLog(question, 'user');

        // Clear the question input after sending
        const currentQuestion = question.trim();
        setQuestion('');
        setIsLoading(true); // Show loading indicator

        try {
            // Prepare data to send to backend
            const payload = {
                question: currentQuestion,
                company_website: companyWebsite.trim(),
                company_description: aboutCompany.trim(),
            };

            // Handle file upload if a file is selected
            if (companyFile) {
                try {
                    const base64Data = await fileToBase64(companyFile);
                    payload.file_data = base64Data;
                    payload.file_name = companyFile.name;
                    payload.file_type = companyFile.type;
                    
                    console.log(`File prepared for upload: ${companyFile.name} (${companyFile.size} bytes)`);
                } catch (fileError) {
                    console.error('Error processing file:', fileError);
                    addMessageToChatLog('Error processing the uploaded file. Please try again.', 'ai');
                    setIsLoading(false);
                    return;
                }
            }

            console.log('Sending payload to backend:', {
                ...payload,
                file_data: payload.file_data ? '[BASE64 DATA]' : undefined // Don't log the actual base64 data
            });

            // Determine backend URL based on environment
            const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const backendApiUrl = isDevelopment 
                ? 'http://localhost:5000/api/chat'  // Local development
                : 'https://fleetworthy-sales-api.onrender.com/api/chat'; // Production

            const response = await fetch(backendApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response from backend:', data);
            
            addMessageToChatLog(data.message || 'No response from AI agent.', 'ai');

            // Show received data info in console for testing
            if (data.received_data) {
                console.log('Backend confirmed it received:', data.received_data);
            }

        } catch (error) {
            console.error('Error communicating with AI agent:', error);
            addMessageToChatLog(`Oops! There was an error: ${error.message}. Please try again.`, 'ai');
        } finally {
            setIsLoading(false); // Hide loading indicator
        }
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                addMessageToChatLog('File is too large. Please select a file smaller than 5MB.', 'ai');
                e.target.value = ''; // Clear the file input
                return;
            }
            
            // Check file type
            const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().match(/\.(pdf|txt|doc|docx)$/)) {
                addMessageToChatLog('File type not supported. Please upload a PDF, TXT, DOC, or DOCX file.', 'ai');
                e.target.value = ''; // Clear the file input
                return;
            }
            
            setCompanyFile(file);
            console.log('File selected:', file.name, file.type, file.size);
        } else {
            setCompanyFile(null);
        }
    };

    return (
        <div className="w-full md:w-8/12 space-y-6">

             {/* Chat Log Area */}
             <div>
                <h3 className="text-xl font-semibold text-base-content mb-2">Chat Log:</h3>
                <div ref={chatLogRef} id="chat-log-area" className={`min-h-[300px] max-h-[500px] p-4 bg-gray-50 border border-gray-200 rounded-md shadow-inner overflow-y-auto flex flex-col space-y-3`}>
                    {/* Display loading spinner/message when isLoading is true */}
                    {isLoading && (
                        <div className="flex justify-center items-center py-4">
                            <span className="loading loading-spinner text-primary"></span>
                            <p className="ml-2 text-gray-600">AI Agent is thinking...</p>
                        </div>
                    )}
                    {chatLog.map((msg, index) => (
                        <div key={index} className={`chat ${msg.sender === 'user' ? 'chat-end' : 'chat-start'}`}>
                            <div className={`chat-bubble ${msg.sender === 'user' ? 'chat-bubble-info' : 'chat-bubble-neutral'}`}>
                                {msg.message}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Question Section */}
            <div className="form-control">
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
                        className="input input-bordered w-full flex-grow"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyPress={(e) => { if (e.key === 'Enter' && !isLoading) handleAsk(); }}
                        disabled={isLoading}
                    />
                    <button 
                        type="button" 
                        id="askButton" 
                        className="btn btn-primary" 
                        onClick={handleAsk}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Thinking...' : 'Ask'}
                    </button>
                </div>
            </div>

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
                    className="input input-bordered w-full"
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
                    className="textarea textarea-bordered h-auto resize-y w-full"
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
                    className="file-input file-input-bordered w-full"
                    onChange={handleFileChange}
                />
                <label className="label">
                    <span className="label-text-alt">
                        Max file size: 5MB. Supported formats: PDF, TXT, DOC, DOCX.
                        {companyFile && (
                            <span className="text-success ml-2">
                                ✓ {companyFile.name} ({Math.round(companyFile.size / 1024)}KB)
                            </span>
                        )}
                    </span>
                </label>
            </div>
        </div>
    );
}

export default AgentInteraction;