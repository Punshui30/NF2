import os
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import anthropic

# ---------- Setup ----------
load_dotenv()
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
if not ANTHROPIC_API_KEY:
    raise RuntimeError("ANTHROPIC_API_KEY missing in .env")

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

MODEL_NAME = "claude-3-5-sonnet-20240620"  # or the Claude model you want

app = FastAPI(title="NorthForm Brain", version="0.1.0")

allowed_origins = [o.strip() for o in (os.getenv("ALLOWED_ORIGINS") or "").split(",") if o.strip()]
if not allowed_origins:
    allowed_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Schemas ----------
class UserInputs(BaseModel):
    lifeScenarios: List[str] = Field(default_factory=list)
    decisionStyle: Optional[str] = None
    lifeVision: Optional[str] = None
    focusAreas: List[str] = Field(default_factory=list)
    socialSignals: Optional[Dict[str, Any]] = None
    biometrics: Optional[Dict[str, Any]] = None

class DecisionRequest(BaseModel):
    decision: str
    options: List[str]
    userInputs: UserInputs

class DecisionResponse(BaseModel):
    recommendation: str
    reasoning: List[str]
    emotional_drivers: List[str]
    neural_pathway_shift: List[str]
    confidence: int
    suggestedNextSteps: List[str]

# ---------- Prompt Templates ----------
SYSTEM_INSTRUCTIONS = """You are NorthForm's cognitive engine.
You synthesize: Internal Family Systems (IFS), Big Five, Enneagram, Strengths, CBT/REBT, habit loops, motivation science,
emotion regulation (HRV, interoception), and decision science (Bayesian thinking, expected value, regret minimization).
You are precise, compassionate, and practical. Avoid generic advice. Use the user's inputs deeply.

Always return JSON that EXACTLY matches the required schema:
{
  "recommendation": string,
  "reasoning": [string, ...],
  "emotional_drivers": [string, ...],
  "neural_pathway_shift": [string, ...],
  "confidence": integer 0-100,
  "suggestedNextSteps": [string, ...]
}

Rules:
- Compare options against user values, constraints, and context.
- Surface cognitive biases explicitly when relevant (but as concise bullets).
- Translate psychology into concrete next actions.
- Quantify confidence (0–100) and justify it.
- If inputs are thin, ask for *exactly the missing info* in one bullet within suggestedNextSteps.
"""

def build_prompt(payload: DecisionRequest) -> str:
    opts = "\n".join([f"- {o}" for o in payload.options])
    scenarios = ", ".join(payload.userInputs.lifeScenarios or [])
    focus = ", ".join(payload.userInputs.focusAreas or [])
    social = payload.userInputs.socialSignals or {}
    biom = payload.userInputs.biometrics or {}

    return f"""
User Decision:
{payload.decision}

Options:
{opts}

User Context:
- Decision style: {payload.userInputs.decisionStyle or "unspecified"}
- Life vision: {payload.userInputs.lifeVision or "unspecified"}
- Scenarios: {scenarios or "unspecified"}
- Focus areas: {focus or "unspecified"}

Signals:
- Social (optional): {social}
- Biometrics (optional): {biom}

Task:
Apply IFS, Big Five, Enneagram, strengths & values alignment,
decision science, and behavior change science.
Resolve internal conflicts; identify emotional drivers; propose neural pathway shifts
(habits, reframes, exposure ladders, somatic resets, environmental design).

Return JSON ONLY following the schema. Be specific and non-generic.
"""

# ---------- Routes ----------
@app.get("/health")
def health():
    return {"ok": True, "service": "northform-brain", "model": MODEL_NAME}

@app.post("/analyze/decision", response_model=DecisionResponse)
def analyze_decision(req: DecisionRequest):
    if len(req.options) < 2:
        raise HTTPException(status_code=400, detail="Provide at least two options.")

    prompt = build_prompt(req)

    try:
        resp = client.messages.create(
            model=MODEL_NAME,
            max_tokens=1000,
            temperature=0.6,
            system=SYSTEM_INSTRUCTIONS,
            messages=[{"role": "user", "content": prompt}],
        )

        content = resp.content[0].text.strip()

        import json
        data = json.loads(content)
        return DecisionResponse(**data)

    except json.JSONDecodeError:
        raise HTTPException(status_code=502, detail="Claude response was not valid JSON.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
