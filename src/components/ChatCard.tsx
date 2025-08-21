import React, { useState } from "react";
import VoiceInputButton from "./VoiceInputButton";

type Props = {
  title: "Family" | "Friend" | "Work/Collab" | string;
  text: string;
  setText: (v: string) => void;
  tags: string[];
  setTags: (v: string[]) => void;
};

const ChatCard: React.FC<Props> = ({ title, text, setText, tags, setTags }) => {
  const [tagInput, setTagInput] = useState("");

  function addTagFromInput() {
    const t = tagInput.trim();
    if (!t) return;
    if (!tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { e.preventDefault(); addTagFromInput(); }
  }

  function removeTag(t: string) { setTags(tags.filter((x) => x !== t)); }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">{title}</div>
        <VoiceInputButton label="Speak" onAppend={(t) => setText(text ? text + "\n" + t : t)} />
      </div>

      <textarea
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500/40 mb-2"
        placeholder="Paste 3–8 lines from a recent conversation. You can redact names."
      />

      <div className="flex items-center gap-2">
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Add tags (e.g., conflict, support)…"
          className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500/40"
        />
        <button
          onClick={addTagFromInput}
          className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white text-sm"
        >
          Add
        </button>
      </div>

      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="px-2 py-1 rounded-full bg-white/10 border border-white/20 text-xs">
              {t}
              <button className="ml-2 text-white/60 hover:text-white" onClick={() => removeTag(t)}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatCard;
