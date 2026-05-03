import { Priority } from "./types";

const urgentKeywords = [
  "not working", "urgent", "emergency", "fire", "spark", "sparking",
  "smoke", "flood", "burst", "danger", "hazard", "electric shock",
  "no power", "gas leak", "broken", "completely stopped",
];

const lowKeywords = [
  "minor", "small", "slight", "little", "occasional", "intermittent",
  "cosmetic", "when possible", "no rush", "low priority",
];

export function detectPriority(problem: string): Priority {
  const lower = problem.toLowerCase();
  
  for (const keyword of urgentKeywords) {
    if (lower.includes(keyword)) return "urgent";
  }
  
  for (const keyword of lowKeywords) {
    if (lower.includes(keyword)) return "low";
  }
  
  return "normal";
}
