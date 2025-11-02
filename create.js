document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quizForm");
  const container = document.getElementById("questionsContainer");
  let count = 0;

  document.getElementById("addQuestionBtn").onclick = () => {
    count++;
    const q = document.createElement("div");
    q.className = "question";
    q.style = "background:#333; padding:10px; border-radius:8px; margin-top:10px;";

    q.innerHTML = `
      <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;">
        <label style="font-weight:bold;">Q${count}:</label>
        <input type="text" class="questionText" placeholder="Enter question" required
          style="flex:2;min-width:150px;padding:5px;border:none;border-radius:5px;background:#3a3a3a;color:#fff;">
        
        <label>Type:</label>
        <select class="questionType"
          style="flex:1;min-width:120px;padding:5px;border:none;border-radius:5px;background:#3a3a3a;color:#fff;">
          <option value="single">Single</option>
          <option value="multiple">Multiple</option>
          <option value="boolean">True/False</option>
        </select>

        <label>Points:</label>
        <input type="number" class="questionPoints" value="1" min="1"
          style="width:60px;padding:5px;border:none;border-radius:5px;background:#3a3a3a;color:#fff;">

        <button type="button" class="removeQuestionBtn"
          style="margin-left:auto;background:#ff6b6b;color:white;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;">
          Remove
        </button>
      </div>

      <div class="optionsSection" style="margin-top:10px;">
        <div class="optionsContainer"></div>
        <button type="button" class="addOptionBtn"
          style="margin-top:8px;background:#70ff98;color:#1e1e1e;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;">
          + Add Option
        </button>
        <div class="errorMsg" style="color:#ff6b6b;margin-top:5px;display:none;">
          Select at least one correct answer.
        </div>
      </div>
    `;

    const typeSelect = q.querySelector(".questionType");
    const optionsContainer = q.querySelector(".optionsContainer");
    const addOptionBtn = q.querySelector(".addOptionBtn");
    const errorMsg = q.querySelector(".errorMsg");

    function addOption(value = "", removable = true) {
      const type = typeSelect.value;
      const currentCount = optionsContainer.children.length;
      if (currentCount >= 8) return alert("Maximum 8 options allowed.");

      const optionDiv = document.createElement("div");
      optionDiv.style = "display:flex;align-items:center;gap:6px;margin-top:5px;";

      optionDiv.innerHTML = `
        <input type="${type === "multiple" ? "checkbox" : "radio"}"
          class="correctOption" name="correct-${count}" style="cursor:pointer;">
        <input type="text" class="optionText"
          value="${value}" placeholder="Option ${currentCount + 1}" required
          style="flex:1;padding:5px;border:none;border-radius:5px;background:#3a3a3a;color:#fff;">
      `;

      if (removable) {
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "×";
        removeBtn.type = "button";
        removeBtn.style =
          "background:#ff6b6b;color:white;border:none;padding:2px 6px;border-radius:4px;cursor:pointer;";
        removeBtn.onclick = () => {
          if (optionsContainer.children.length > 2) {
            optionDiv.remove();
            updateCorrectNames();
          } else {
            alert("A question must have at least 2 options.");
          }
        };
        optionDiv.appendChild(removeBtn);
      }

      optionsContainer.appendChild(optionDiv);
      updateCorrectNames();
    }

    for (let i = 0; i < 4; i++) addOption();
    addOptionBtn.onclick = () => addOption();

    function updateCorrectNames() {
      const type = typeSelect.value;
      const correctInputs = optionsContainer.querySelectorAll(".correctOption");
      correctInputs.forEach((input) => {
        input.type = type === "multiple" ? "checkbox" : "radio";
        input.name = `correct-${count}`;
      });
    }

    typeSelect.addEventListener("change", () => {
      const type = typeSelect.value;
      optionsContainer.innerHTML = "";

      if (type === "boolean") {
        addOption("True", false);
        addOption("False", false);
        addOptionBtn.disabled = true;
      } else {
        addOptionBtn.disabled = false;
        for (let i = 0; i < 4; i++) addOption();
      }

      updateCorrectNames();
    });

    q.querySelector(".removeQuestionBtn").onclick = () => q.remove();
    container.appendChild(q);
  };

  form.onsubmit = (e) => {
    e.preventDefault();

    const title = form.quizTitle.value.trim();
    const description = form.quizDescription.value.trim();

    if (!title) {
      alert("Please enter a quiz title.");
      form.quizTitle.focus();
      return;
    }

    if (!description) {
      alert("Please enter a quiz description.");
      form.quizDescription.focus();
      return;
    }

    const questionsElements = [...container.querySelectorAll(".question")];

    for (let i = 0; i < questionsElements.length; i++) {
      const q = questionsElements[i];
      const correct = [...q.querySelectorAll(".correctOption")]
        .map((c, i) => (c.checked ? i : null))
        .filter((i) => i !== null);

      const errorMsg = q.querySelector(".errorMsg");
      if (correct.length === 0) {
        errorMsg.style.display = "block";
        errorMsg.scrollIntoView({ behavior: "smooth" });
        return;
      } else {
        errorMsg.style.display = "none";
      }
    }

    const quiz = {
      title,
      description,
      questions: questionsElements.map((q, i) => {
        const type = q.querySelector(".questionType").value;
        const options = [...q.querySelectorAll(".optionText")].map((o) => o.value.trim());
        const correct = [...q.querySelectorAll(".correctOption")]
          .map((c, i) => (c.checked ? i : null))
          .filter((i) => i !== null);
        const points = parseInt(q.querySelector(".questionPoints").value) || 1;

        return {
          id: `q${i + 1}`,
          type,
          text: q.querySelector(".questionText").value.trim(),
          choices: options,
          correct,
          points,
        };
      }),
    };

    const quizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
    quizzes.push(quiz);
    localStorage.setItem("quizzes", JSON.stringify(quizzes));

    alert("Quiz saved!");
    form.reset();
    container.innerHTML = "";
    count = 0;
  };
});
