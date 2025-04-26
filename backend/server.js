const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors')
app.use(cors())
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;

app.use(bodyParser.json());

mongoose.connect(MONGO_URL)
    .then(() => console.log('MongoDB Connected'))
    .catch(console.error);

// Schemas
const Quiz = mongoose.model('Quiz', new mongoose.Schema({
    name: String,
}));

const Question = mongoose.model('Question', new mongoose.Schema({
    quizId: mongoose.Schema.Types.ObjectId,
    topic: String,
    question: String,
    options: [String],
    answer: Number,
}));

const Result = mongoose.model('Result', new mongoose.Schema({
    quizId: mongoose.Schema.Types.ObjectId,
    answers: [Number],
    result: [],
    topicAnalysis: {},
    score: Number,
    createdAt: { type: Date, default: Date.now },
}));

// Routes

// Create Quiz with Questions
app.post('/quiz/create', async (req, res) => {
    const quiz = new Quiz({ name: req.body.name });
    await quiz.save();

    const questions = req.body.questions.map(q => ({ ...q, quizId: quiz._id }));
    await Question.insertMany(questions);

    res.json({ success: true, quizId: quiz._id });
});

// Get all quizzes
app.get('/quizzes', async (req, res) => {
    const quizzes = await Quiz.find();
    res.json(quizzes);
});

// Get questions of a quiz
app.get('/quiz/:id', async (req, res) => {
    const questions = await Question.find({ quizId: req.params.id });
    res.json(questions.map(q => ({
        _id: q._id,
        topic: q.topic,
        question: q.question,
        options: q.options,
    })));
});

// Submit answers and get result
app.post('/quiz/submit/:id', async (req, res) => {
    const userAnswers = req.body.answers;
    const questions = await Question.find({ quizId: req.params.id });

    const result = [];
    const topicStats = {};
    let score = 0;

    questions.forEach((q, i) => {
        const isCorrect = q.answer === userAnswers[i];
        if (isCorrect) score++;

        result.push({
            question: q.question,
            selectedAnswer: userAnswers[i] !== undefined ? q.options[userAnswers[i]] : 'Not Attempted',
            correctAnswer: q.options[q.answer],
            topic: q.topic,
            isCorrect
        });

        if (!topicStats[q.topic]) topicStats[q.topic] = { total: 0, correct: 0 };
        topicStats[q.topic].total++;
        if (isCorrect) topicStats[q.topic].correct++;
    });

    const topicAnalysis = Object.fromEntries(
        Object.entries(topicStats).map(([topic, stat]) => [
            topic,
            {
                total: stat.total,
                correct: stat.correct,
                percentage: ((stat.correct / stat.total) * 100).toFixed(2) + "%"
            }
        ])
    );

    const resultDoc = new Result({
        quizId: req.params.id,
        answers: userAnswers,
        result,
        topicAnalysis,
        score,
    });

    await resultDoc.save();

    res.json({
        total: questions.length,
        correct: score,
        result,
        topicAnalysis
    });
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
