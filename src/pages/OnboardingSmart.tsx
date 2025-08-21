import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyze } from "../services/api";
import { profileStore, completeness } from "../services/profileStore";
import ChatCard from "../components/ChatCard";
import ConstellationProgress from "../components/ConstellationProgress";
import BreathingNorthStar from "../components/BreathingNorthStar";
import { CinematicButton } from "../components/ui/CinematicButton";

export default function OnboardingChat() {
  const navigate = useNavigate();
  const [fam, setFam] = useState("");
  const [famTags, setFamTags] = useState<string[]>([]);
  const [frd, setFrd] = useState("");
  const [frdTags, setFrdTags] = useState<string[]>([]);
  const [wrk, setWrk] = useState("");
  const [wrkTags, setWrkTags] = useState<string[]>([]);
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const profile = profileStore.get();
  const progress =
    completeness({ ...profile, conv: { fam, frd, wrk } });

  async function handleAnalyze() {
    profileStore.merge({
      conv: { fam, frd, wrk },
      tags: { fam: famTags, frd: frdTags, wrk: wrkTags }
    });

    setLoading(true);
    try {
      const { text } = await analyze(
        "Onboarding summary",
        {},
        profileStore.get()
      );
      setResponse(text);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-4 flex flex-col gap-6">
      <BreathingNorthStar />
      <ConstellationProgress value={progress} />

      <ChatCard title="Family" text={fam} setText={setFam} tags={famTags} setTags={setFamTags} />
      <ChatCard title="Friend" text={frd} setText={setFrd} tags={frdTags} setTags={setFrdTags} />
      <ChatCard title="Work/Collab" text={wrk} setText={setWrk} tags={wrkTags} setTags={setWrkTags} />

      <div className="flex gap-4 mt-4">
        <CinematicButton onClick={handleAnalyze} loading={loading} variant="aurora">
          Analyze
        </CinematicButton>
        {response && (
          <CinematicButton onClick={() => navigate("/tools/decision-compass")}>
            Send to Decision Compass
          </CinematicButton>
        )}
      </div>

      {response && (
        <div className="mt-4 p-4 rounded-xl bg-white/10 border border-white/20 whitespace-pre-wrap text-sm text-white">
          {response}
        </div>
      )}
    </div>
  );
}
