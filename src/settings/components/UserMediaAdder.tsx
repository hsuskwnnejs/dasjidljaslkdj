import React, { useState } from "react";
import { saveUserMediaLinks, getUserMediaLinks } from "@/features/user-media/userMedia";

export default function UserMediaAdder() {
  const [inputValue, setInputValue] = useState("");
  const [links, setLinks] = useState<string[]>(getUserMediaLinks());

  const addLink = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const updated = [...links, trimmed];
    setLinks(updated);
    saveUserMediaLinks(updated);
    setInputValue("");
  };

  const removeLink = (index: number) => {
    const updated = links.filter((_, i) => i !== index);
    setLinks(updated);
    saveUserMediaLinks(updated);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h3 style={{ marginBottom: "0.5rem" }}>Add Custom Image/Video URLs</h3>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter an image or video URL..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{
            flex: 1,
            padding: "0.5rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={addLink}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "none",
            background: "#007bff",
            color: "white",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      {links.length === 0 && <p>No custom media links added yet.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {links.map((link, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
              wordBreak: "break-all",
            }}
          >
            <span>{link}</span>
            <button
              onClick={() => removeLink(i)}
              style={{
                border: "none",
                background: "red",
                color: "white",
                borderRadius: "6px",
                padding: "0.25rem 0.5rem",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
