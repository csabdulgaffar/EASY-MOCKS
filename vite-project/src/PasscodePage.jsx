import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
PASSCODE = import.meta.env.VITE_PASSCODE

const PasscodePage = ({ setAuthorized }) => {
    const [code, setCode] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (code === 'PASSCODE') {
            setAuthorized(true);
            navigate('/create-quiz');
        } else {
            alert('Incorrect passcode');
        }
    };

    return (
        <div className="p-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">Enter Password to get authorize to create a mock</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-64">
                <input
                    type="password"
                    placeholder="Enter passcode"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="border p-2"
                />
                <button type="submit" className="bg-gray-600 text-white py-2 cursor-pointer rounded">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default PasscodePage;
