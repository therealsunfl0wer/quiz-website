document.addEventListener("DOMContentLoaded", () => {
  const quizList = document.getElementById("quizList");
  const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [];

  quizList.innerHTML = "";

  if (quizzes.length === 0) {
    quizList.innerHTML = "<li><em>No quizzes yet. Create one!</em></li>";
    return;
  }

  quizzes.forEach((quiz, index) => {
    const li = document.createElement("li");
    const link = document.createElement("a");

    link.href = `play.html?id=${index}`;
    link.textContent = quiz.title;

    li.appendChild(link);
    quizList.appendChild(li);
  });
});
