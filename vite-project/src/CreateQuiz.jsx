import React, { useState } from 'react';
import axios from 'axios';

const CreateQuiz = () => {
    const [quizName, setQuizName] = useState('');
    const [questions, setQuestions] = useState([
        { topic: '', question: '', options: ['', '', '', ''], answer: 0 }
    ]);

    const handleQuestionChange = (index, field, value) => {
        const updated = [...questions];
        updated[index][field] = value;
        setQuestions(updated);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const updated = [...questions];
        updated[qIndex].options[oIndex] = value;
        setQuestions(updated);
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { topic: '', question: '', options: ['', '', '', ''], answer: 0 }
        ]);
    };

    const submitQuiz = async () => {
        try {
            const res = await axios.post('http://localhost:5000/quiz/create', {
                name: quizName,
                questions
            });
            alert('Quiz Created Successfully!');
            setQuizName('');
            setQuestions([{ topic: '', question: '', options: ['', '', '', ''], answer: 0 }]);
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl m
            -4 font-bold">Create new Mock Test</h2>

            <input
                type="text"
                placeholder="Mock Name"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
                className="border p-2 mb-4 w-full"
            />

            {questions.map((q, i) => (
                <div key={i} className="border p-4 mb-4 rounded shadow">
                    <h4 className="mb-2 font-semibold">Question {i + 1}</h4>

                    <input
                        type="text"
                        placeholder="Topic"
                        value={q.topic}
                        onChange={(e) => handleQuestionChange(i, 'topic', e.target.value)}
                        className="border p-2 mb-2 w-full"
                    />

                    <input
                        type="text"
                        placeholder="Question"
                        value={q.question}
                        onChange={(e) => handleQuestionChange(i, 'question', e.target.value)}
                        className="border p-2 mb-2 w-full"
                    />

                    {q.options.map((opt, j) => (
                        <input
                            key={j}
                            type="text"
                            placeholder={`Option ${j + 1}`}
                            value={opt}
                            onChange={(e) => handleOptionChange(i, j, e.target.value)}
                            className="border p-2 mb-2 w-full"
                        />
                    ))}

                    <select
                        value={q.answer}
                        onChange={(e) => handleQuestionChange(i, 'answer', Number(e.target.value))}
                        className="border p-2 w-full"
                    >
                        <option value={0}>Correct Answer: Option 1</option>
                        <option value={1}>Correct Answer: Option 2</option>
                        <option value={2}>Correct Answer: Option 3</option>
                        <option value={3}>Correct Answer: Option 4</option>
                    </select>
                </div>
            ))}

            <button onClick={addQuestion} className="bg-gray-800 text-white px-4 py-2 rounded mr-4">
                + Add Question
            </button>

            <button onClick={submitQuiz} className="bg-green-600 text-white px-4 py-2 rounded">
                Submit New Mock
            </button>
        </div>
    );
};

export default CreateQuiz;
