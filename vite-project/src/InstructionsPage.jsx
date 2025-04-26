// src/components/InstructionsPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const InstructionsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen py-10 flex justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl w-full">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Quiz Instructions</h2>
                <ul className="space-y-3 text-gray-700 text-lg">
                    <li className="pl-4 border-l-4 border-gray-800">On home page you can see available mocks.</li>
                    <li className="pl-4 border-l-4 border-gray-800">Click to start a mock.</li>
                    <li className="pl-4 border-l-4 border-gray-800">Navigate questions using Previous/Next or question panel.</li>
                    <li className="pl-4 border-l-4 border-gray-800">You can exit using "Exit Quiz" button and return to home page.</li>
                    <li className="pl-4 border-l-4 border-gray-800">Your performance will be shown in the analysis after submission.</li>
                    <li className="pl-4 border-l-4 border-gray-800">Use "Back to Home" button to go back to the main page.</li>
                    <li className="pl-4 border-l-4 border-gray-800">You can create a mock if you want to contribute.</li>
                </ul>
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gray-800 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition duration-200"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstructionsPage;
