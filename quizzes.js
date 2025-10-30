export const exampleQuiz = {
    id: 'quiz_example_1',
    title: 'Simple Example Quiz',
    description: 'A short demo quiz showing single, multiple, and boolean question types.',
    questions: [
        {
            id: 'q1',
            type: 'single', // 'single' = one correct choice
            text: 'What is the capital of France?',
            choices: ['Berlin', 'Madrid', 'Paris', 'Rome'],
            correct: [2], // indexes into choices
            points: 1
        },
        {
            id: 'q2',
            type: 'multiple', // 'multiple' = one or more correct choices
            text: 'Select all prime numbers',
            choices: ['2', '3', '4', '5'],
            correct: [0, 1, 3],
            points: 3
        },
        {
            id: 'q3',
            type: 'boolean', // boolean uses choices like ['True','False']
            text: 'The sky appears blue on a clear day.',
            choices: ['True', 'False'],
            correct: [0],
            points: 1
        }
    ]
};

/**
 * Grade a quiz submission.
 * @param {Object} quiz - quiz object (like exampleQuiz)
 * @param {Object} answers - map of questionId -> array of selected choice indexes
 * @returns {Object} result with total score, maxScore and per-question details
 *
 * Example answers:
 * { q1: [2], q2: [0,3], q3: [0] }
 */
export function gradeQuiz(quiz, answers) {
    let totalScore = 0;
    let maxScore = 0;
    const details = quiz.questions.map((q) => {
        const submitted = Array.isArray(answers?.[q.id]) ? answers[q.id] : [];
        const correctSet = new Set(q.correct);
        const submittedSet = new Set(submitted.map((i) => Number(i)).filter((n) => Number.isInteger(n)));

        const correctSelectedCount = [...submittedSet].filter((i) => correctSet.has(i)).length;
        const incorrectSelectedCount = [...submittedSet].filter((i) => !correctSet.has(i)).length;
        const totalCorrectCount = q.correct.length;

        let earned = 0;

        if (q.type === 'single' || q.type === 'boolean') {
            // full points only if exact match (one selected and it matches)
            if (submitted.length === 1 && correctSet.has(Number(submitted[0]))) earned = q.points;
        } else if (q.type === 'multiple') {
            // proportional scoring: correct picks count positively, wrong picks penalize.
            // Score fraction = max(0, (correctSelected - incorrectSelected) / totalCorrect)
            const frac = Math.max(0, (correctSelectedCount - incorrectSelectedCount) / Math.max(1, totalCorrectCount));
            earned = Math.round((frac * q.points) * 100) / 100; // round to 2 decimals
        } else {
            // default: require exact same set
            const isExact = submittedSet.size === correctSet.size && [...submittedSet].every((i) => correctSet.has(i));
            if (isExact) earned = q.points;
        }

        totalScore += earned;
        maxScore += q.points;

        return {
            questionId: q.id,
            submitted: Array.from(submittedSet),
            correct: Array.from(correctSet),
            earned,
            max: q.points,
            isCorrect: earned === q.points
        };
    });

    return {
        score: Math.round(totalScore * 100) / 100,
        maxScore,
        details
    };
}