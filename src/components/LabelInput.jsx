import React, { useState } from "react";
import "./labelinput.css";

export default function LabelInput({ labels, setLabels }) {
  const [text, setText] = useState("");

  const addLabel = () => {
    const v = text.trim();
    if (!v) return;
    setLabels([...labels, v]);
    setText("");
  };

  const onEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addLabel();
    }
  };

  const removeLabel = (index) => {
    setLabels(labels.filter((_, i) => i !== index));
  };

  return (
    <div className="label-input-root">
      <div className="label-add-row">
        <input
          className="label-input-box"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onEnter}
          placeholder="Enter label name (optional)"
        />
        <button
          type="button"
          className="label-add-btn"
          onClick={addLabel}
          aria-label="Add label"
        >
          +
        </button>
      </div>

      <div className="label-chips">
        {labels.map((lab, idx) => (
          <div className="label-chip" key={idx}>
            <span className="label-chip-text">{lab}</span>
            <button
              type="button"
              className="label-chip-remove"
              onClick={() => removeLabel(idx)}
              aria-label={`Remove ${lab}`}
            >
              ✖
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}