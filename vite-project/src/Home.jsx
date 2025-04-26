import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(3600);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000/quizzes').then(res => setQuizzes(res.data));
    }, []);

    useEffect(() => {
        if (selectedQuizId && !submitted) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        submitQuiz();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [selectedQuizId, submitted]);

    const formatTime = () => {
        const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const seconds = (timeLeft % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const startQuiz = async (id) => {
        setSelectedQuizId(id);
        const res = await axios.get(`http://localhost:5000/quiz/${id}`);
        setQuestions(res.data);
        setAnswers(Array(res.data.length).fill(null));
        setSubmitted(false);
        setResult(null);
        setCurrentQuestionIndex(0);
        setTimeLeft(3600);
    };

    // const submitQuiz = async () => {
    //     const res = await axios.post(`http://localhost:5000/quiz/submit/${selectedQuizId}`, {
    //         answers
    //     });
    //     setResult(res.data);
    //     setSubmitted(true);
    // };
    const submitQuiz = async () => {
        const res = await axios.post(`http://localhost:5000/quiz/submit/${selectedQuizId}`, {
            answers
        });

        const skippedCount = answers.filter(ans => ans === null).length;

        setResult({ ...res.data, skipped: skippedCount }); // attach skipped count to result
        setSubmitted(true);
    };



    // const handleOptionChange = (questionIndex, optionIndex) => {
    //     const newAnswers = [...answers];
    //     newAnswers[questionIndex] = optionIndex;
    //     setAnswers(newAnswers);
    // };
    const handleOptionChange = (questionIndex, optionIndex) => {
        const newAnswers = [...answers];
        // Toggle selection: if the same option is clicked, unselect it, otherwise select it
        newAnswers[questionIndex] = newAnswers[questionIndex] === optionIndex ? null : optionIndex;
        setAnswers(newAnswers);
    };


    const renderAnswerOption = (questionIndex, optionIndex, option, correctAnswer, selectedAnswer) => (
        // <label key={optionIndex} className="block p-4 rounded-lg hover:bg-gray-100 transition-all">
        //     <input
        //         type="radio"
        //         name={`q-${questionIndex}`}
        //         checked={answers[questionIndex] === optionIndex}
        //         onChange={() => handleOptionChange(questionIndex, optionIndex)}
        //         disabled={submitted}
        //         className="mr-2"
        //     />
        //     <span>
        //         {String.fromCharCode(65 + optionIndex)}. {option}
        //         {submitted && correctAnswer === option && (
        //             <span className="ml-2 text-green-600">✅</span>
        //         )}
        //         {submitted && selectedAnswer === option && correctAnswer !== option && (
        //             <span className="ml-2 text-red-600">❌</span>
        //         )}
        //     </span>
        // </label>
        <div
            key={optionIndex}
            onClick={() => handleOptionChange(questionIndex, optionIndex)}
            className={`cursor-pointer border rounded-xl p-4 mb-3 transition-all duration-200 ${answers[questionIndex] === optionIndex
                ? 'bg-gray-600 text-white'
                : 'bg-white hover:bg-gray-100'
                } ${submitted ? 'pointer-events-none' : ''}`}
        >
            <div className="flex items-center space-x-2">
                <div className="font-semibold">
                    {String.fromCharCode(65 + optionIndex)}.
                </div>
                <div className="flex-1">
                    {option}
                    {submitted && correctAnswer === option && (
                        <span className="ml-2 text-green-300">✅</span>
                    )}
                    {submitted &&
                        selectedAnswer === option &&
                        correctAnswer !== option && (
                            <span className="ml-2 text-red-300">❌</span>
                        )}
                </div>
            </div>
        </div>

    );

    if (submitted && result) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Mock Test Result</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2 text-gray-700">
                        <p className="text-base">✅ Total Questions: <span className="font-medium">{result.total}</span></p>
                        <p className="text-base">✔️ Correct Answers: <span className="font-medium">{result.correct}</span></p>
                        <p className="text-base">❌ Incorrect Answers: <span className="font-medium">{result.total - (result.correct + result.skipped)}</span></p>
                        <p className="text-base">⏭️ Skipped Questions: <span className="font-medium">{result.skipped}</span></p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-4">
                        <div className="text-xl font-semibold text-gray-500 mb-1">SCORE</div>
                        <p className="text-3xl font-extrabold text-gray-800">
                            {2 * result.correct - (2 / 3) * (result.total - (result.correct + result.skipped))}
                        </p>
                    </div>
                </div>





                <h3 className="mt-6 text-lg font-semibold">Topicwise Analysis</h3>
                <ul className="list-disc pl-6">
                    {Object.entries(result.topicAnalysis).map(([topic, stats]) => (
                        <li key={topic}>{topic}: {stats.correct}/{stats.total} ({stats.percentage})</li>
                    ))}
                </ul>

                <h3 className="my-5 text-lg font-semibold">Review Your Answers</h3>
                {result.result.map((r, index) => (
                    <div key={index} className="mb-4 border-b pb-4">
                        <p className="font-medium whitespace-pre-line">{index + 1}) {r.question}</p>
                        {questions[index].options.map((opt, i) =>
                            renderAnswerOption(index, i, opt, r.correctAnswer, r.selectedAnswer)
                        )}
                        <p className={`mt-1 ${r.selectedAnswer === null || r.selectedAnswer === undefined
                            ? 'text-yellow-600'
                            : r.isCorrect
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}>
                            {r.selectedAnswer === null || r.selectedAnswer === undefined
                                ? 'Skipped'
                                : r.isCorrect
                                    ? 'Correct'
                                    : 'Incorrect'}
                        </p>

                    </div>
                ))}

                <button
                    className="mt-6 bg-gray-800 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                    onClick={() => {
                        setSelectedQuizId(null);
                        setQuestions([]);
                        setAnswers([]);
                        setSubmitted(false);
                        setResult(null);
                        setCurrentQuestionIndex(0);
                        setTimeLeft(3600);
                    }}
                >
                    Back to Home
                </button>
            </div>
        );
    }

    if (selectedQuizId && questions.length > 0) {
        const q = questions[currentQuestionIndex];

        return (
            <div className="p-6 max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Quiz</h2>
                    <span className="text-red-600 font-semibold text-lg">⏳ {formatTime()}</span>
                </div>

                <div className="mb-6">
                    <p className="text-md font-medium mb-2 whitespace-pre-line">{currentQuestionIndex + 1}) {q.question}</p>
                    {q.options.map((opt, i) =>
                        renderAnswerOption(currentQuestionIndex, i, opt)
                    )}
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        className="bg-gray-800 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                        disabled={currentQuestionIndex === 0}
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                        className="bg-gray-800 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                        disabled={currentQuestionIndex === questions.length - 1}
                    >
                        Next
                    </button>
                </div>
                <div className="py-5">
                    <div className="py-3" > Navigate to Question Number:</div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {questions.map((_, i) => (
                            <button
                                key={i}
                                className={`w-8 h-8 rounded-full font-semibold text-sm transition ${i === currentQuestionIndex ? 'bg-blue-600 text-white' :
                                    answers[i] !== null ? 'bg-green-500 text-white' : 'bg-gray-200'
                                    }`}
                                onClick={() => setCurrentQuestionIndex(i)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                </div>

                <div className="mt-6 flex space-between">
                    <div>
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                            onClick={submitQuiz}
                        >
                            Submit Test
                        </button>
                    </div>
                    <div>
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
                            onClick={() => {
                                setSelectedQuizId(null);
                                setQuestions([]);
                                setAnswers([]);
                                setSubmitted(false);
                                setResult(null);
                                setCurrentQuestionIndex(0);
                                setTimeLeft(3600);
                                navigate('/');
                            }}
                        >
                            Exit Test
                        </button>
                    </div>

                </div>
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-3xl font-bold mb-6">📚 Available Mock Tests</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quizzes.map(quiz => (
                    <button
                        key={quiz._id}
                        className="w-full bg-gray-800 hover:bg-gray-900 text-white text-lg font-medium px-6 py-4 rounded-lg shadow transition-all"
                        onClick={() => startQuiz(quiz._id)}
                    >
                        {quiz.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Home;
