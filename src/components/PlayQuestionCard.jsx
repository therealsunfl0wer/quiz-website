import "/src/styles/App.css";

function PlayQuestionCard({
  q,
  index,
  answers,
  submitted,
  handleChange,
  getQuestionStatus,
  getChoiceClass,
}) {
  const inputType = q.type === "multiple" ? "checkbox" : "radio";

  return (
    <div key={index} className={`question ${getQuestionStatus(q, index)}`}>
      <h3>
        {index + 1}. {q.text}
      </h3>

      {q.choices.map((choice, i) => {
        const inputId = `q${index}-choice${i}`;

        return (
          <div className="choice-row" key={i}>
            <input
              type={inputType}
              name={`q${index}`}
              id={inputId}
              disabled={submitted}
              checked={(answers[index] || []).includes(i)}
              onChange={() => handleChange(index, i, q.type)}
            />
            <label htmlFor={inputId} className={getChoiceClass(q, index, i)}>
              {choice}
            </label>
          </div>
        );
      })}
    </div>
  );
}

export default PlayQuestionCard;
