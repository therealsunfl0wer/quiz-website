import { useState } from "react";
import "/src/styles/App.css";

const getInitialQuizzes = () => {
  const data = localStorage.getItem("quizzes");
  return data ? JSON.parse(data) : [];
};

function Manage() {
  const [quizzes, setQuizzes] = useState(getInitialQuizzes);

  const deleteQuiz = (indexToDelete) => {
    const updatedQuizzes = quizzes.filter(
      (_, index) => index !== indexToDelete,
    );
    localStorage.setItem("quizzes", JSON.stringify(updatedQuizzes));
    setQuizzes(updatedQuizzes);
  };

  const QuizItem = ({ quiz, index }) => (
    <li className="quiz-list-item">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <strong style={{ fontSize: "1.1em" }}>
            {quiz.title || "Untitled Quiz"}
          </strong>
          <span
            style={{ marginLeft: "10px", color: "#666", fontSize: "0.9em" }}
          >
            ({quiz.questions.length} questions)
          </span>
          <p style={{ margin: "5px 0", color: "#888", fontSize: "0.9em" }}>
            {quiz.description || "No description provided."}
          </p>
        </div>
        <button
          onClick={() => deleteQuiz(index)}
          className="secondary-button"
          style={{ padding: "8px 12px", alignSelf: "flex-start" }}
        >
          Delete
        </button>
      </div>
    </li>
  );

  return (
    <main style={{ padding: "20px" }}>
      <div id="testsListContainer">
        <h2>My Quizzes</h2>
        <ul id="localstorageTestsList" style={{ paddingLeft: 0 }}>
          {quizzes.length === 0 ? (
            <p>No saved quizzes found. Start by creating one!</p>
          ) : (
            quizzes.map((quiz, index) => (
              <QuizItem key={index} quiz={quiz} index={index} />
            ))
          )}
        </ul>
      </div>
    </main>
  );
}

export default Manage;
