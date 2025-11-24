import "/src/styles/OptionInput.css";

export default function OptionInput({
  index,
  text,
  type,
  isCorrect,
  onTextChange,
  onToggleCorrect,
  onRemove,
  removable,
}) {
  return (
    <div className="option-row">
      <input
        className="correct-checkbox"
        type={type === "multiple" ? "checkbox" : "radio"}
        checked={isCorrect}
        onChange={onToggleCorrect}
      />

      <input
        className="option-text-input"
        type="text"
        value={text}
        placeholder={`Option ${index + 1}`}
        onChange={(e) => onTextChange(e.target.value)}
      />

      {removable && (
        <button className="remove-option-btn" type="button" onClick={onRemove}>
          ×
        </button>
      )}
    </div>
  );
}
