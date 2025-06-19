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
            <h3 className="text-2xl font-bold text-black mb-4">Request a Demo:</h3>
            <form onSubmit={handleContactFormSubmit} className="space-y-4">
                <div className="form-control">
                    <label htmlFor="contactName" className="label text-black">
                        <span className="label-text">Your Name:</span>
                    </label>
                    <input type="text" id="contactName" name="contactName" required className="input input-bordered w-full" />
                </div>
                <div className="form-control">
                    <label htmlFor="contactEmail" className="label text-black">
                        <span className="label-text">Your Email:</span>
                    </label>
                    <input type="email" id="contactEmail" name="contactEmail" required className="input input-bordered w-full" />
                </div>
                <div className="form-control">
                    <label htmlFor="contactCompany" className="label text-black">
                        <span className="label-text">Your Company:</span>
                    </label>
                    <input type="text" id="contactCompany" name="contactCompany" className="input input-bordered w-full" />
                </div>
                <div className="form-control">
                    <label htmlFor="contactMessage" className="label text-black">
                        <span className="label-text">Message (optional):</span>
                    </label>
                    <textarea id="contactMessage" name="contactMessage" rows="3" className="textarea textarea-bordered h-auto resize-y"></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-full"> {/* DaisyUI btn and btn-primary */}
                    Submit Demo Request
                </button>
            </form>
        </div>
    );
}

export default ContactForm;
