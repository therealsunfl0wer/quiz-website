
const resultsList = document.getElementById('resultsList');
const results = JSON.parse(localStorage.getItem('quizResults')) || [];
const incorrectAnswers = JSON.parse(localStorage.getItem('incorrectAnswers')) || [];

if (!resultsList) throw new Error('No #resultsList element found');

if (results.length === 0) {
    resultsList.innerHTML = '<p>No completed quizzes yet.</p>';
} else {
    // Sort by date descending so recent attempts appear first
    results
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach((result) => {
            const attempt = document.createElement('div');
            attempt.className = 'attempt';

            const header = document.createElement('div');
            header.className = 'attempt-header';
            const date = new Date(result.date).toLocaleString();
            header.innerHTML = `<strong>${result.title}</strong> — ${result.score}/${result.maxScore} <span class="muted">(${date})</span>`;
            attempt.appendChild(header);

            // Find incorrect answers for this specific playID
            const thisAttemptIncorrect = incorrectAnswers.filter(
                (ans) => ans.playID === result.playID,
            );

            if (thisAttemptIncorrect.length > 0) {
                const answersContainer = document.createElement('div');
                answersContainer.className = 'answers-container';

                thisAttemptIncorrect.forEach((answer) => {
                    const block = document.createElement('div');
                    block.className = 'stylingBlock';
                    block.innerHTML = `
                        <h3 class="question">${escapeHtml(answer.question)}</h3>
                        <p class="user-answer"><strong>Your answer:</strong> ${escapeHtml(answer.userAnswer)}</p>
                        <p class="correct-answer"><strong>Correct answer:</strong> ${escapeHtml(answer.correctAnswer)}</p>
                    `;
                    answersContainer.appendChild(block);
                });

                attempt.appendChild(answersContainer);
            } else {
                const note = document.createElement('div');
                note.className = 'no-mistakes';
                note.textContent = 'No incorrect answers for this attempt.';
                attempt.appendChild(note);
            }

            resultsList.appendChild(attempt);
        });
}

// small helper to avoid inserting raw HTML from storage
function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

