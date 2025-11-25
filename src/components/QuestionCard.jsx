import "/src/styles/QuestionCard.css";
import OptionInput from "/src/components/OptionInput";

export default function QuestionCard({ question, onChange, onRemove }) {
  const { text, type, points, options, correct } = question;

  const updateOption = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    onChange({ options: updated });
  };

  const addOption = () => {
    if (options.length >= 8) return alert("Maximum 8 options allowed.");
    onChange({ options: [...options, ""] });
  };

  const removeOption = (index) => {
    if (options.length <= 2)
      return alert("A question must have at least 2 options.");

    const updated = options.filter((_, i) => i !== index);
    const updatedCorrect = correct.filter((i) => i !== index);

    onChange({ options: updated, correct: updatedCorrect });
  };

  const toggleCorrect = (index) => {
    if (type === "multiple") {
      const updated = correct.includes(index)
        ? correct.filter((i) => i !== index)
        : [...correct, index];
      onChange({ correct: updated });
    } else {
      onChange({ correct: [index] });
    }
  };

  const setType = (newType) => {
    if (newType === "boolean") {
      onChange({
        type: newType,
        options: ["True", "False"],
        correct: [],
      });
    } else {
      onChange({ type: newType, correct: [] });
    }
  };

  return (
    <div className="question-card">
      <div className="question-top-row">
        <input
          className="question-input"
          type="text"
          value={text}
          placeholder="Enter question"
          onChange={(e) => onChange({ text: e.target.value })}
        />

        <select
          className="type-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="single">Single</option>
          <option value="multiple">Multiple</option>
          <option value="boolean">True/False</option>
        </select>

        <input
          className="points-input"
          type="number"
          min={1}
          value={points}
          onChange={(e) => onChange({ points: Number(e.target.value) })}
        />

        <button className="remove-question-btn" type="button" onClick={onRemove}>
          Remove
        </button>
      </div>

      <div className="options-section">
        {options.map((op, i) => (
          <OptionInput
            key={i}
            index={i}
            text={op}
            type={type}
            isCorrect={correct.includes(i)}
            onTextChange={(value) => updateOption(i, value)}
            onToggleCorrect={() => toggleCorrect(i)}
            onRemove={() => removeOption(i)}
            removable={type !== "boolean"}
          />
        ))}

        {type !== "boolean" && (
          <button type="button" className="add-option-btn" onClick={addOption}>
            + Add Option
          </button>
        )}
      </div>
    </div>
  );
}
