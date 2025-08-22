import React, { useState } from "react";
import { motion } from "framer-motion";

const OnboardingSmart: React.FC = () => {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<
    { sender: "user" | "ai"; text: string }[]
  >([]);

  const steps = [
    "Welcome to NorthForm. What’s the big decision or challenge on your mind?",
    "Got it. What’s one constraint or factor you feel is shaping this decision?",
    "Thanks. Anything else you’d like me to know before I start guiding?",
  ];

  const handleNext = async () => {
    if (!input.trim()) return;

    // Add user message
    setHistory((prev) => [...prev, { sender: "user", text: input }]);

    // Simulate AI response
    let aiResponse = "";
    if (step < steps.length - 1) {
      aiResponse = steps[step + 1];
    } else {
      aiResponse =
        "Thanks — I’ve got enough to begin guiding you. Let’s continue on the dashboard.";
    }

    setHistory((prev) => [...prev, { sender: "ai", text: aiResponse }]);
    setInput("");
    setStep((s) => s + 1);
  };

  return (
    <div className="aurora-bg min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-lg rainbow-ring w-full max-w-2xl p-8 space-y-6"
      >
        <h1 className="text-3xl font-bold text-white text-center">
          Smart Onboarding
        </h1>
        <p className="text-white/70 text-center">
          Let’s connect the dots — tell me a bit, and I’ll guide you forward.
        </p>

        <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
          {history.map((msg, i) => (
            <div
              key={i}
              className={`msg ${
                msg.sender === "user"
                  ? "msg-user bg-cyan-500/20 text-cyan-100 ml-auto"
                  : "msg-ai bg-white/10 text-white mr-auto"
              } max-w-[85%]`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <textarea
          className="textarea"
          rows={3}
          value={input}
          placeholder={
            step < steps.length ? steps[step] : "You’re ready to continue!"
          }
          onChange={(e) => setInput(e.target.value)}
          disabled={step >= steps.length}
        />

        <div className="flex justify-end space-x-3">
          {step < steps.length && (
            <button className="btn btn-primary" onClick={handleNext}>
              Next
            </button>
          )}
          {step >= steps.length && (
            <button
              className="btn btn-ghost"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Go to Dashboard →
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingSmart;
