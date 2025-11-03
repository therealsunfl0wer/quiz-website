// === 1. Колекція всіх тестів ===
export const initialQuizzes = [
  {
    id: "quiz_example_1",
    title: "Simple Example Quiz",
    description:
      "A short demo quiz showing single, multiple, and boolean question types.",
    questions: [
      {
        id: "q1",
        type: "single", // одна відповідь
        text: "What is the capital of France?",
        choices: ["Berlin", "Madrid", "Paris", "Rome"],
        correct: [2],
        points: 1,
      },
      {
        id: "q2",
        type: "multiple", // декілька виборів
        text: "Select all prime numbers",
        choices: ["2", "3", "4", "5"],
        correct: [0, 1, 3],
        points: 3,
      },
      {
        id: "q3",
        type: "boolean", // для true/false
        text: "The sky appears blue on a clear day.",
        choices: ["True", "False"],
        correct: [0],
        points: 1,
      },
    ],
  },

  {
    id: "quiz_math",
    title: "Math Basics",
    description: "Simple math test",
    questions: [
      {
        id: "q1",
        type: "single",
        text: "2 + 2 = ?",
        choices: ["3", "4", "5"],
        correct: [1],
        points: 1,
      },
      {
        id: "q2",
        type: "boolean",
        text: "5 is prime?",
        choices: ["True", "False"],
        correct: [0],
        points: 1,
      },
    ],
  },
];

if (!localStorage.getItem("quizzes")) {
  localStorage.setItem("quizzes", JSON.stringify(initialQuizzes));
}

// === 2. Функція перевірки результатів ===
export function gradeQuiz(quiz, answers) {
  let totalScore = 0;
  let maxScore = 0;

  const details = quiz.questions.map((q) => {
    const submitted = Array.isArray(answers?.[q.id]) ? answers[q.id] : [];
    const correctSet = new Set(q.correct);
    const submittedSet = new Set(
      submitted.map((i) => Number(i)).filter((n) => Number.isInteger(n)),
    );

    const correctSelectedCount = [...submittedSet].filter((i) =>
      correctSet.has(i),
    ).length;
    const incorrectSelectedCount = [...submittedSet].filter(
      (i) => !correctSet.has(i),
    ).length;
    const totalCorrectCount = q.correct.length;

    let earned = 0;

    if (q.type === "single" || q.type === "boolean") {
      // повні бали тільки при точній відповіді
      if (submitted.length === 1 && correctSet.has(Number(submitted[0])))
        earned = q.points;
    } else if (q.type === "multiple") {
      // часткове нарахування
      const frac = Math.max(
        0,
        (correctSelectedCount - incorrectSelectedCount) /
          Math.max(1, totalCorrectCount),
      );
      earned = Math.round(frac * q.points * 100) / 100;
    } else {
      const isExact =
        submittedSet.size === correctSet.size &&
        [...submittedSet].every((i) => correctSet.has(i));
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
      isCorrect: earned === q.points,
    };
  });

  return {
    score: Math.round(totalScore * 100) / 100,
    maxScore,
    details,
  };
}
