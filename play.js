import { quizzes, gradeQuiz } from "./quizzes.js";

// 1. Зчитуємо id тесту з URL
const params = new URLSearchParams(window.location.search);
const quizId = params.get("id");
const quiz = quizzes[quizId];

// 2. Якщо тест не знайдено
if (!quiz) {
  document.body.innerHTML = `<h2>Quiz not found.</h2>`;
} else {
  // 3. Виводимо назву та опис
  document.getElementById("quiz-title").textContent = quiz.title;
  document.getElementById("quiz-description").textContent = quiz.description;

  const questionsDiv = document.getElementById("questions");

  // 4. Малюємо всі питання
  quiz.questions.forEach((q) => {
    const qDiv = document.createElement("div");
    qDiv.innerHTML = `
      <h3>${q.text}</h3>
      ${q.choices
        .map(
          (choice, i) => `
        <label>
          <input type="${
            q.type === "multiple" ? "checkbox" : "radio"
          }" name="${q.id}" value="${i}"> ${choice}
        </label><br>`
        )
        .join("")}
      <hr>
    `;
    questionsDiv.appendChild(qDiv);
  });

  // 5. Обробка кнопки Submit
  document.getElementById("submit-btn").addEventListener("click", () => {
    const answers = {};
    quiz.questions.forEach((q) => {
      const selected = [
        ...document.querySelectorAll(`input[name="${q.id}"]:checked`),
      ].map((el) => Number(el.value));
      answers[q.id] = selected;
    });

    // 6. Перевіряємо результати
    const result = gradeQuiz(quiz, answers);
    document.getElementById(
      "result"
    ).innerHTML = `<h2>Score: ${result.score}/${result.maxScore}</h2>`;

    // 7. Підсвічуємо правильні/неправильні
    result.details.forEach((d) => {
      const qInputs = document.querySelectorAll(`input[name="${d.questionId}"]`);
      qInputs.forEach((input, i) => {
        if (d.correct.includes(i))
          input.parentElement.style.color = "green";
        else if (d.submitted.includes(i))
          input.parentElement.style.color = "red";
      });
    });

    // 8. Зберігаємо у localStorage результати
    const collection = JSON.parse(localStorage.getItem("quizResults") || "{}");
    collection[quiz.id] = {
      title: quiz.title,
      score: result.score,
      max: result.maxScore,
      date: new Date().toISOString(),
    };
    localStorage.setItem("quizResults", JSON.stringify(collection));
  });
}
