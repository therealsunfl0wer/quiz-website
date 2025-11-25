import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PlayQuestionCard from "/src/components/PlayQuestionCard.jsx";
import "/src/styles/App.css";

function Play() {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const quizId = search.get("id");

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [scoreData, setScoreData] = useState(null);

  // react 19 compliant async abomination
  useEffect(() => {
    let cancelled = false;

    async function loadQuiz() {
      const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
      const found = quizzes.find((q) => q.id === quizId);

      if (!found) {
        navigate("/");
        return;
      }

      if (!cancelled) {
        setQuiz(found);
      }
    }

    loadQuiz();
    return () => {
      cancelled = true;
    };
  }, [quizId, navigate]);

  if (!quiz) return <p>Loading...</p>;

  const maxScore = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);

  function handleChange(qIndex, choiceIndex, qType) {
    setAnswers((prev) => {
      const existing = prev[qIndex] || [];

      if (qType === "multiple") {
        // toggle checkbox
        if (existing.includes(choiceIndex)) {
          return {
            ...prev,
            [qIndex]: existing.filter((i) => i !== choiceIndex),
          };
        } else {
          return {
            ...prev,
            [qIndex]: [...existing, choiceIndex],
          };
        }
      }

      // radio / boolean
      return { ...prev, [qIndex]: [choiceIndex] };
    });
  }

  function submitQuiz() {
    const attemptId = `attempt_${Date.now()}`;
    let score = 0;
    const incorrectAttempt = [];

    quiz.questions.forEach((q, index) => {
      const selected = answers[index] || [];
      const correctArr = [...q.correct].sort((a, b) => a - b);
      const selectedArr = [...selected].sort((a, b) => a - b);

      const isCorrect =
        correctArr.length === selectedArr.length &&
        correctArr.every((v, i) => v === selectedArr[i]);

      if (isCorrect) {
        score += q.points || 1;
      }

      if (!isCorrect) {
        incorrectAttempt.push({
          attemptId,
          quizId,
          quizTitle: quiz.title,
          question: q.text,
          userAnswer:
            selected.length > 0
              ? selected.map((i) => q.choices[i]).join(", ")
              : "(no answer)",
          correctAnswer: q.correct.map((i) => q.choices[i]).join(", "),
        });
      }
    });

    // Save quiz results
    const results = JSON.parse(localStorage.getItem("quizResults")) || [];
    results.push({
      attemptId,
      quizId,
      title: quiz.title,
      score,
      maxScore,
      date: new Date().toISOString(),
    });
    localStorage.setItem("quizResults", JSON.stringify(results));

    // Save incorrect answers
    const incorrect =
      JSON.parse(localStorage.getItem("incorrectAnswers")) || [];
    localStorage.setItem(
      "incorrectAnswers",
      JSON.stringify([...incorrect, ...incorrectAttempt])
    );

    setScoreData({ score, maxScore });
    setSubmitted(true);
  }

  // Styling helpers
  function getQuestionStatus(q, index) {
    if (!submitted) return "";

    const selected = answers[index] || [];
    const correct = q.correct;

    const exact =
      selected.length === correct.length &&
      [...selected].sort().every((v, i) => v === [...correct].sort()[i]);

    if (exact) return "correct";

    const hasCorrect = selected.some((v) => correct.includes(v));
    const hasWrong = selected.some((v) => !correct.includes(v));

    if (q.type === "multiple" && hasCorrect && (hasWrong || !hasWrong))
      return "partial";

    return "incorrect";
  }

  function getChoiceClass(q, qIndex, choiceIndex) {
    if (!submitted) return "";

    const selected = answers[qIndex] || [];
    const isSelected = selected.includes(choiceIndex);
    const isCorrect = q.correct.includes(choiceIndex);

    return [
      isSelected ? "selected" : "",
      isCorrect ? "choice-correct" : "",
      isSelected && !isCorrect ? "choice-wrong" : "",
      isSelected && isCorrect ? "choice-chosen-correct" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  // Render
  return (
    <div className="play-container">
      <h1>{quiz.title}</h1>
      <p>{quiz.description}</p>

      <div id="questions">
        {quiz.questions.map((q, index) => (
          <PlayQuestionCard
            key={index}
            q={q}
            index={index}
            answers={answers}
            submitted={submitted}
            handleChange={handleChange}
            getQuestionStatus={getQuestionStatus}
            getChoiceClass={getChoiceClass}
          />
        ))}
      </div>

      {!submitted && (
        <button id="submit-btn" onClick={submitQuiz}>
          Submit
        </button>
      )}

      {scoreData && (
        <div id="result">
          <h2>
            Score: {scoreData.score}/{scoreData.maxScore}
          </h2>
        </div>
      )}
    </div>
  );
}

export default Play;
