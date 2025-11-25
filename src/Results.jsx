import { useState, useEffect } from "react";
import "/src/styles/App.css";

const fetchResultsData = async () => {
  const results = JSON.parse(localStorage.getItem("quizResults")) || [];
  const incorrectAnswers =
    JSON.parse(localStorage.getItem("incorrectAnswers")) || [];
  return { results, incorrectAnswers };
};

const IncorrectAnswerBlock = ({ answer }) => (
  <div className="stylingBlock" style={{ marginBottom: "15px" }}>
    <h3 className="question">{answer.question}</h3>
    <p className="user-answer">Your answer: **{answer.userAnswer}**</p>
    <p className="correct-answer">Correct answer: **{answer.correctAnswer}**</p>
  </div>
);

const ResultAttempt = ({ result, incorrectAnswers }) => {
  const date = new Date(result.date);

  const quizIncorrect = incorrectAnswers.filter(
    (answer) => answer.attemptId === result.attemptId
  );

  return (
    <li className="quiz-list-item" style={{ marginBottom: "30px" }}>
      <div className="quiz-title">
        <b>{result.title}</b>
      </div>
      <div className="quiz-score" style={{ marginBottom: "10px" }}>
        Score: {result.score}/{result.maxScore}
      </div>
      <small style={{ color: "#aaa", display: "block" }}>
        Attempted on: {date.toLocaleString()}
      </small>

      {quizIncorrect.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            borderTop: "1px solid #333",
            paddingTop: "15px",
          }}
        >
          <h4>Mistakes ({quizIncorrect.length})</h4>
          {quizIncorrect.map((answer, index) => (
            <IncorrectAnswerBlock key={index} answer={answer} />
          ))}
        </div>
      )}
    </li>
  );
};

function Results() {
  const [data, setData] = useState({ results: [], incorrectAnswers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const fetchedData = await fetchResultsData();
        if (isMounted) {
          setData(fetchedData);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to load quiz results:", error);
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const { results, incorrectAnswers } = data;

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Loading Results...</h1>
      </div>
    );
  }

  return (
    <main className="content" style={{ padding: "20px" }}>
      <h1>Your Results History</h1>
      <p style={{ fontStyle: "italic", color: "#ccc" }}>
        Here you can review your past performance and mistakes.
      </p>

      <ul
        id="resultsList"
        className="results-container"
        style={{ paddingLeft: 0 }}
      >
        {results.length === 0 ? (
          <p style={{ marginTop: "20px" }}>No completed quizzes yet.</p>
        ) : (
          results.map((result, index) => (
            <ResultAttempt
              key={index}
              result={result}
              incorrectAnswers={incorrectAnswers}
            />
          ))
        )}
      </ul>
    </main>
  );
}

export default Results;
