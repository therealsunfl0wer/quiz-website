import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "/src/styles/App.css";

function Home() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    async function loadInitialQuizzes() {
      let stored = null;

      try {
        stored = JSON.parse(localStorage.getItem("quizzes"));
      } catch {
        stored = null;
      }

      if (Array.isArray(stored) && stored.length > 0) {
        setQuizzes(stored);
        return;
      }

      const res = await fetch("/src/data/initialQuizzes.json");
      const data = await res.json();

      localStorage.setItem("quizzes", JSON.stringify(data));
      setQuizzes(data);
    }

    loadInitialQuizzes();
  }, []);

  return (
    <>
      <main>
        <div className="header">
          <h1>
            Welcome to <strong>The Awesome Quiz Website</strong>
          </h1>
          <p>
            Here you can choose a quiz from the existing ones or create a new
            one. You can also see your results or manage all quizzes. Use all
            your knowledge and imagination!
          </p>
          <img src="src/assets/favicon.png" className="logo-home" />
        </div>

        <div className="quizzes-container">
          <div className="panel">
            <p>
              <strong>My quizzes</strong>
            </p>
            <ul className="quiz-list">
              {quizzes.map((quiz) => (
                <li key={quiz.id}>
                  <Link to={`/play?id=${quiz.id}`}>{quiz.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="other-panel">
            <p>
              <strong>Other options</strong>
            </p>
            <div className="other-button">
              <Link to="/results">
                <button>My results</button>
              </Link>
              <Link to="/manage">
                <button>Manage quizzes</button>
              </Link>
              <Link to="/create">
                <button>Create a new quiz</button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;
