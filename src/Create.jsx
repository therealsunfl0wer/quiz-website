import { useState } from "react";
import "/src/styles/Create.css";

import QuestionCard from "/src/components/QuestionCard";

function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        text: "",
        type: "single",
        points: 1,
        options: ["", "", "", ""],
        correct: [],
      },
    ]);
  };

  const updateQuestion = (id, updated) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updated } : q))
    );
  };

  const removeQuestion = (id) =>
    setQuestions(questions.filter((q) => q.id !== id));

  const saveQuiz = (e) => {
    e.preventDefault();

    if (!title.trim()) return alert("Please enter a quiz title.");
    if (!description.trim()) return alert("Please enter a quiz description.");

    for (const q of questions) {
      if (q.correct.length === 0) {
        alert("Each question needs at least one correct answer.");
        return;
      }
    }

    const quiz = {
      id: `quiz_${Date.now()}`,
      title,
      description,
      questions: questions.map((q, i) => ({
        id: `q${i + 1}`,
        text: q.text,
        type: q.type,
        points: q.points,
        choices: q.options,
        correct: q.correct,
      })),
    };

    const stored = JSON.parse(localStorage.getItem("quizzes") || "[]");
    stored.push(quiz);
    localStorage.setItem("quizzes", JSON.stringify(stored));

    alert("Quiz saved!");
    setTitle("");
    setDescription("");
    setQuestions([]);
  };

  return (
    <div className="create-quiz-page">
      <h1 className="page-title">Create a New Quiz</h1>

      <form className="quiz-form" onSubmit={saveQuiz}>
        <label className="label">Quiz Title:</label>
        <input
          className="text-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="label">Description:</label>
        <textarea
          className="textarea-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <h3 className="questions-header">Questions</h3>

        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            onChange={(updated) => updateQuestion(q.id, updated)}
            onRemove={() => removeQuestion(q.id)}
          />
        ))}

        <div className="button-row">
          <button
            type="button"
            className="add-question-btn"
            onClick={addQuestion}
          >
            + Add Question
          </button>

          <button type="submit" className="save-quiz-btn">
            Save Quiz
          </button>
        </div>
      </form>
    </div>
  );
}

export default Create;
