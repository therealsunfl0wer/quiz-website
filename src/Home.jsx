import { Link } from "react-router-dom";
import "/src/styles/App.css";
import Create from "/src/Create";
import Results from "/src/Results.jsx";
import Manage from "/src/Manage.jsx";

function Home() {
  return (
    <>
      <main>
        <div class="header">
          <h1>
            Welcome to <strong>The Awesome Quiz Website</strong>
          </h1>
          <p>
            Here you can choose a quiz from the existing ones or create a new
            one. You can also see your results or manage all quizzes. Use all
            your knowledge and imagination!
          </p>
          <img src="src/assets/favicon.png" class="logo-home" />
        </div>

        <div class="quizzes-container">
          <div class="panel">
            <p>
              <strong>My quizzes</strong>
            </p>
            <ul id="quizList"></ul>
          </div>

          <div class="other-panel">
            <p>
              <strong>Other options</strong>
            </p>
            <div class="other-button">
              <Link to={Results}>
                <button>My results</button>
              </Link>
              <Link to={Manage}>
                <button>Manage quizzes</button>
              </Link>
              <Link to={Create}>
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
