import React from 'react';

// ContactForm Component: Handles the demo request form
function ContactForm() {
    const handleContactFormSubmit = (event) => {
        event.preventDefault();
        // In a real application, you'd send this data to a separate backend service (e.g., for email notifications)
        console.log('Demo request submitted!');
        event.target.reset(); // Clear the form
        // You might want to add a temporary message to the UI here to confirm submission
    };

    return (
        <div>
            <h3 className="text-2xl font-bold text-indigo-800 mb-4">Request a Demo:</h3>
            <form onSubmit={handleContactFormSubmit} className="space-y-4">
                <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">Your Name:</label>
                    <input type="text" id="contactName" name="contactName" required className="form-input" />
                </div>
                <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Your Email:</label>
                    <input type="email" id="contactEmail" name="contactEmail" required className="form-input" />
                </div>
                <div>
                    <label htmlFor="contactCompany" className="block text-sm font-medium text-gray-700">Your Company:</label>
                    <input type="text" id="contactCompany" name="contactCompany" className="form-input" />
                </div>
                <div>
                    <label htmlFor="contactMessage" className="block text-sm font-medium text-gray-700">Message (optional):</label>
                    <textarea id="contactMessage" name="contactMessage" rows="3" className="form-input resize-y"></textarea>
                </div>
                <button type="submit" className="primary-button bg-indigo-700 hover:bg-indigo-800">
                    Submit Demo Request
                </button>
            </form>
        </div>
    );
}

export default ContactForm;
