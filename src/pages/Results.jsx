import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

function Results() {
  const [results, setResults] = useState(() => {
    return JSON.parse(localStorage.getItem("quizResults")) || [];
  });

  const [incorrectAnswers, setIncorrectAnswers] = useState(() => {
    return JSON.parse(localStorage.getItem("incorrectAnswers")) || [];
  });

  return (
    <>
      <div className="topbar">
        <Link to="/">Home</Link>
        <Link to="/create">Create</Link>
        <Link to="/results">Results</Link>
        <Link to="/manage">Manage</Link>
      </div>
      <div className="layout">
        <main className="content">
          <h1>Your Results History</h1>
          <p style={{ fontStyle: "italic" }}>
            Here you can review your mistakes
          </p>
          <div id="resultsList" className="results-container">
            {results.length === 0 ? (
              <p>No completed quizzes yet.</p>
            ) : (
              results.map((result, index) => {
                const quizIncorrect = incorrectAnswers.filter(
                  (answer) => answer.attemptId === result.attemptId
                );

                return (
                  <div key={index} className="result-block">
                    <li>
                      <strong>
                        {result.title} — {result.score}/{result.maxScore}
                      </strong>
                      <br />
                      Date & time of your attempt: <br />
                      <small>{new Date(result.date).toLocaleString()}</small>
                    </li>

                    {quizIncorrect.length > 0 && (
                      <ul>
                        {quizIncorrect.map((answer, indexx) => (
                          <div key={indexx} className="stylingBlock">
                            <h3 className="question">{answer.question}</h3>
                            <p className="user-answer">
                              Your answer: {answer.userAnswer}
                            </p>
                            <p className="correct-answer">
                              Correct answer: {answer.correctAnswer}
                            </p>
                          </div>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default Results;
