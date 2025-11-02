document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const quizId = params.get("id");

  const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
  const quiz = quizzes.find(q => q.id === quizId);

  if (!quiz) {
    document.body.innerHTML = `<h2>Quiz not found.</h2>`;
    return;
  }

  document.getElementById("quiz-title").textContent = quiz.title;
  document.getElementById("quiz-description").textContent = quiz.description;

  const questionsDiv = document.getElementById("questions");

  quiz.questions.forEach((q, index) => {
    const qDiv = document.createElement("div");
    qDiv.classList.add("question");
    const inputType = q.type === "multiple" ? "checkbox" : "radio";

    qDiv.innerHTML = `
      <h3>${index + 1}. ${q.text}</h3>
      ${q.choices
        .map(
          (choice, i) => `
        <label>
          <input type="${inputType}" name="q${index}" value="${i}"> ${choice}
        </label><br>`,
        )
        .join("")}
      <hr>
    `;

    questionsDiv.appendChild(qDiv);
  });

  document.getElementById("submit-btn").addEventListener("click", () => {
    let score = 0;

    quiz.questions.forEach((q, index) => {
      const selected = [
        ...document.querySelectorAll(`input[name="q${index}"]:checked`),
      ].map((el) => parseInt(el.value));

      const correct = q.correct.sort().join(",");
      const chosen = selected.sort().join(",");
      if (correct === chosen) {
        score += q.points || 1;
      }
    });

    const maxScore = quiz.questions.reduce(
      (sum, q) => sum + (q.points || 1),
      0,
    );

    document.getElementById("result").innerHTML =
      `<h2>Score: ${score}/${maxScore}</h2>`;

    const results = JSON.parse(localStorage.getItem("quizResults")) || [];
    results.push({
      title: quiz.title,
      score,
      maxScore,
      date: new Date().toISOString(),
    });
    localStorage.setItem("quizResults", JSON.stringify(results));
  });
});
