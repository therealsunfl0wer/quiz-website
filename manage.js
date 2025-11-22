document.addEventListener('DOMContentLoaded', () => {

  function getTests() {
    const data = localStorage.getItem('quizzes');
    return data ? JSON.parse(data) : [];
  }

  function renderTests() {
    const list = document.getElementById('localstorageTestsList');
    if (!list) return; 
    list.innerHTML = '';

    const tests = getTests();

    if (tests.length === 0) {
      list.innerHTML = '<li>No saved tests.</li>';
      return;
    }

    tests.forEach((test, index) => {
      const li = document.createElement('li');
      li.style.marginBottom = "10px";
      li.innerHTML = `
        <strong>${test.title || 'Без назви'}</strong>
        <span style="margin-left: 10px; color: #ccc;">(${test.questions.length} questions)</span>
        <p style="margin:5px 0; color:#aaa;">${test.description || ''}</p>
        <button class="delete-btn" data-index="${index}" style="background:#ff6b6b;color:white;border:none;padding:3px 8px;border-radius:4px;cursor:pointer;">Delete</button>
      `;
      list.appendChild(li);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        deleteTest(index);
      });
    });
  }

  function deleteTest(index) {
    const tests = getTests();
    tests.splice(index, 1);
    localStorage.setItem('quizzes', JSON.stringify(tests));
    renderTests();
  }

  renderTests();
});
