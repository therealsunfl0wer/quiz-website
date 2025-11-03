import { initialQuizzes } from "./quizzes.js";

document.addEventListener("DOMContentLoaded", () => {
  const quizList = document.getElementById("quizList");
  let quizzes = null;
  try {
    quizzes = JSON.parse(localStorage.getItem("quizzes"));
  } catch (e) {
    quizzes = null;
  }

  if (!Array.isArray(quizzes) || quizzes.length === 0) {
    localStorage.setItem("quizzes", JSON.stringify(initialQuizzes));
    quizzes = initialQuizzes.slice();
  }

  quizzes.forEach((quiz) => {
    const li = document.createElement("li");
    const link = document.createElement("a");

    link.href = `play.html?id=${quiz.id}`;
    link.textContent = quiz.title;

    li.appendChild(link);
    quizList.appendChild(li);
  });
});
