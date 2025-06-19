import React from 'react';

// ContactInfo Component: Displays static Fleetworthy contact information
function ContactInfo() {
    return (
        <div>
            <h3 className="text-2xl font-bold text-black mb-4">Fleetworthy Contact Info</h3>
            <p className="text-gray-700 mb-2"><strong>Phone:</strong> 1-800-555-FLYT (3598)</p>
            <p className="text-gray-700 mb-2"><strong>Email:</strong> sales@fleetworthy.com</p>
            <p className="text-gray-700 mb-2"><strong>Address:</strong> 123 Fleet St, Anytown, USA</p>
            <p className="text-gray-700">Feel free to reach out directly for more information!</p>
        </div>
    );
}

export default ContactInfo;
