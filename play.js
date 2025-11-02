document.addEventListener("DOMContentLoaded", () => {
  // Get quiz ID from URL
  const params = new URLSearchParams(window.location.search);
  const quizId = params.get("id");

  // Fetch quiz data from localStorage
  const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
  const quiz = quizzes[quizId];

  // Check if quiz exists
  if (!quiz) {
    document.body.innerHTML = `<h2>Quiz not found.</h2>`;
    return;
  }

  document.getElementById("quiz-title").textContent = quiz.title;
  document.getElementById("quiz-description").textContent = quiz.description;

  const questionsDiv = document.getElementById("questions");

  // Render questions
  quiz.questions.forEach((q, index) => {
    const qDiv = document.createElement("div");
    qDiv.classList.add("question");
    const inputType = q.type === "multiple" ? "checkbox" : "radio";

    qDiv.innerHTML = `
      <h3>${index + 1}. ${q.text}</h3>
      ${q.choices.map((choice, i) => `
      <div class="choice-row">
        <input id="q${index}_c${i}" type="${inputType}" name="q${index}" value="${i}">
        <label for="q${index}_c${i}">${choice}</label>
      </div>
    `).join('')}
      <hr>
    `;

    questionsDiv.appendChild(qDiv);
  });

  document.getElementById("submit-btn").addEventListener("click", () => {
    let score = 0;


    quiz.questions.forEach((q, index) => {
      const selected = [...document.querySelectorAll(`input[name="q${index}"]:checked`)].map((el) => Number(el.value));

      const correctArr = Array.isArray(q.correct) ? [...q.correct].sort((a, b) => a - b) : [];
      const selectedArr = selected.slice().sort((a, b) => a - b);

      if (correctArr.length === selectedArr.length && correctArr.every((v, i) => v === selectedArr[i])) {
        score += q.points || 1;
      }
    });

    const maxScore = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);

    document.getElementById("result").innerHTML = `<h2>Score: ${score}/${maxScore}</h2>`;


    // Add storing results to localStorage
    const results = JSON.parse(localStorage.getItem("quizResults")) || [];
    results.push({
      quizId: quizId,
      title: quiz.title,
      score,
      maxScore,
      date: new Date().toISOString(),
    });
    localStorage.setItem("quizResults", JSON.stringify(results));

    // Mark correct / incorrect choices per question
    quiz.questions.forEach((q, index) => {
      const correctArr = Array.isArray(q.correct) ? [...q.correct].sort((a, b) => a - b) : [];
      const selectedArr = [...document.querySelectorAll(`input[name="q${index}"]:checked`)].map((el) => Number(el.value)).sort((a, b) => a - b);

      const questionDiv = document.querySelectorAll('.question')[index];
      const questionIsCorrect = correctArr.length === selectedArr.length && correctArr.every((v, i) => v === selectedArr[i]);
      if (questionDiv) questionDiv.classList.add(questionIsCorrect ? 'correct' : 'incorrect');

      // Highlight each choice label
      if (Array.isArray(q.choices)) {
        q.choices.forEach((choice, i) => {
          const input = document.querySelector(`input[name="q${index}"][value="${i}"]`);
          const label = document.querySelector(`label[for="q${index}_c${i}"]`) || (input ? input.nextElementSibling : null);
          const isCorrectChoice = correctArr.includes(i);
          const isSelected = input ? input.checked : false;
          if (label) {
            if (isCorrectChoice) label.classList.add('choice-correct');
            if (isSelected && !isCorrectChoice) label.classList.add('choice-wrong');
            if (isSelected && isCorrectChoice) label.classList.add('choice-chosen-correct');
          }
        });
      }
    });

    // Disable inputs after submission
    document.querySelectorAll('#questions input').forEach((el) => (el.disabled = true));
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) submitBtn.disabled = true;
  });
});
