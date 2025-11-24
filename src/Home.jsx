import "./App.css";

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
          <img src="src/assets/favicon.png" class="logo" />
        </div>

        <div class="layout">
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
              <a href="results.html">
                <button>My results</button>
              </a>
              <a href="manage.html">
                <button>Manage quizzes</button>
              </a>
              <a href="create.html">
                <button>Create a new quiz</button>
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;
