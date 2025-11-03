
const resultsList = document.getElementById('resultsList');
const results = JSON.parse(localStorage.getItem('quizResults')) || [];

const incorrectAnswers = JSON.parse(localStorage.getItem('incorrectAnswers')) || [];

if (results.length === 0) {
    resultsList.innerHTML = 'No completed quizzes yet.';
}

results.forEach((result) => {
    const list = document.createElement('li');
    list.textContent = `${result.title} — ${result.score}/${result.maxScore}`;
    resultsList.appendChild(list);

    const quizIncorrect = incorrectAnswers.filter(
      (answer) => answer.quizTitle === result.title
    );

    
    if(quizIncorrect.length > 0) {
        const answersContainer = document.createElement('ul');
        quizIncorrect.forEach((answer) => {
            const block = document.createElement('div');
            block.innerHTML = `
                <h3 class="question">${answer.question}</h3>
                <p class="user-answer">Your answer: ${answer.userAnswer}</p>
                <p class="correct-answer">Correct answer: ${answer.correctAnswer}</p>
            `;
            answersContainer.appendChild(block);
        })
        resultsList.appendChild(answersContainer);
    } 
}); 

