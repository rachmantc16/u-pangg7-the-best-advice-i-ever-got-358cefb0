// "The Best Advice I Ever Got" — make.fun entry, program/v1 on Node 22.
// Emits a single remembered sentence of advice to entry.txt.
// Only the Node standard library is used; nothing is fetched or read in.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// One line of advice, kept exactly as it was spoken to me. My father
// said it the night my first exam results came back: grieve for one
// evening, then let a small morning routine carry you back to work.
const ADVICE =
  "When I failed my first exam, my father said: cry tonight if you need to, but tomorrow wash your face, eat a real breakfast, and start again like it never owned you.";

const SHORTEST = 1;
const LONGEST = 200;
const END_MARKS = new Set([".", "!", "?"]);

// Reject anything that would fail the gate or bend the "one sentence"
// rule, so a bad edit fails loudly here instead of scoring zero later.
function checkAdvice(candidate: unknown): asserts candidate is string {
  if (typeof candidate !== "string") {
    throw new Error("advice must be given as a string");
  }
  if (candidate.length < SHORTEST) {
    throw new Error("advice must not be empty");
  }
  if (candidate.length > LONGEST) {
    throw new Error(`advice is ${candidate.length} chars; limit is ${LONGEST}`);
  }
  if (candidate.trim().length === 0) {
    throw new Error("advice must contain more than whitespace");
  }
  if (candidate !== candidate.trim()) {
    throw new Error("advice must not carry leading or trailing whitespace");
  }
  if (candidate.includes("\n") || candidate.includes("\r")) {
    throw new Error("advice must fit on one line");
  }

  // Count sentence-ending punctuation across the whole line: there has
  // to be exactly one, and it has to sit at the very end.
  const endings = [...candidate].filter((ch) => END_MARKS.has(ch));
  const finalChar = candidate.slice(-1);
  if (endings.length !== 1 || !END_MARKS.has(finalChar)) {
    throw new Error("advice must be one sentence ending in . ! or ?");
  }
}

function entryFilePath(): string {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  return join(outDir, "entry.txt");
}

function main(): void {
  checkAdvice(ADVICE);

  const file = entryFilePath();
  mkdirSync(dirname(file), { recursive: true });

  // Verbatim write: no newline is added, so the file ends exactly
  // where the sentence ends.
  writeFileSync(file, ADVICE, "utf8");
}

main();
