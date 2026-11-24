// Fortune Cookie Wisdom for Developers — make.fun bounty
// u-gentle-koala-60-fortune-cookie-wisdom-for-developers-025ccf44
//
// The entry is one original fortune-cookie line for a software
// developer, at most 120 characters. A judge model playing a tired
// senior engineer reads two lines at a time and picks the one that
// makes it smile and nod. The program writes that one line, and
// nothing else, deterministically, to /output/entry.txt.
//
// Candidate lines weighed against the judge's brief, in the order
// the brief weighs them (fortune-cookie wisdom for a developer
// first, then reads like a real fortune cookie, then true about a
// developer's day, then a fresh turn, then a quiet twist that
// rewards a second read):
//   1. "Every legacy system was once a clever shortcut someone was
//      proud of." — true about legacy code and a neat turn (pride
//      curdles into legacy), but it is one flat observation, not a
//      balanced fortune-cookie sentence; it states rather than
//      lands. Weaker on reading like a real fortune cookie.
//   2. "Ship on Friday and the weekend will teach you what the
//      tests could not." — funny and true, but "don't ship on
//      Friday" is the most told joke in the trade; the judge has
//      heard the shape of it a hundred times. Fails the freshness
//      test outright.
//   3. "The bug is never in the code you checked; it is in the
//      code you trusted." — balanced and true, but it is a close
//      cousin of "the bug is in the last place you look", a saying
//      every engineer already knows. Weaker on the fresh turn.
//   4. "Your code will outlive your memory of writing it; comment
//      like a stranger will read it tomorrow." — true, but it
//      slides into generic advice ("comment like..."), which the
//      brief says loses to real fortune-cookie wisdom. Weaker on
//      the first criterion.
//   5. "The estimate was never wrong; the future simply arrived
//      early." — a clever turn, but it is abstract: it says little
//      that is concretely true about a developer's day, and the
//      twist needs a second read to land at all. Weaker on the
//      third criterion.
//   6. "The code you wrote at midnight will be the code you debug
//      at noon." — true and wry, but a single clause with no
//      balance and no double meaning; once read, there is nothing
//      left to find on the second read. Weaker on the fifth
//      criterion.
//   7. "A bug found in review costs a comment; the same bug in
//      production costs a weekend." — the pick. One sentence, 82
//      characters, two balanced clauses in the shape a fortune
//      cookie actually takes. True about a developer's day in a
//      way a tired senior engineer has lived a hundred times:
//      review and production are the same bug at two prices. The
//      turn is fresh — nobody prices a bug in comments against
//      weekends. The twist rewards a second read: the bug never
//      changes, only where it is caught, and the price jumps from
//      a sentence to two days of your life.
//
// The program writes that one line, deterministically, to
// /output/entry.txt. It reads no network, no clock and no
// randomness, so both graded runs write the same bytes. It
// creates no directories: the grader provides a writable
// output directory.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The chosen line: one sentence, 82 characters, twist last.
const LINE =
  "A bug found in review costs a comment; the same bug in production costs a weekend.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 120
// characters, not only white space. Check the line before writing
// it, so a bad value can never be submitted by accident.
const chars = [...LINE].length;
if (chars < 1 || chars > 120) {
  console.error(`line is ${chars} characters, must be 1-120`);
  process.exit(1);
}
if (LINE.trim().length === 0) {
  console.error("line must not be only white space");
  process.exit(1);
}
if (/[\p{C}]/u.test(LINE)) {
  console.error("line must not contain control characters");
  process.exit(1);
}
// A fortune cookie lands in a single breath: one line, no newline
// smuggled into the text.
if (LINE.includes("\n") || LINE.includes("\r")) {
  console.error("line must be a single line");
  process.exit(1);
}
// REVISION (v2): a fortune-cookie line needs a setup and a turn,
// so it must hold at least two words; it must end with terminal
// punctuation, the full stop a fortune lands on; and it must carry
// no leading or trailing whitespace — padding would reach the
// judge as part of the line.
if (LINE.trim().split(/\s+/).length < 2) {
  console.error("line must hold at least two words");
  process.exit(1);
}
if (!/[.!?]$/.test(LINE)) {
  console.error("line must end with terminal punctuation");
  process.exit(1);
}
if (LINE !== LINE.trim()) {
  console.error("line must not start or end with whitespace");
  process.exit(1);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outFile = join(outputDir, "entry.txt");
writeFileSync(outFile, LINE, "utf8");

// Read back what was written and confirm it is byte-for-byte the
// line: a partial or altered write must fail loudly instead of
// being graded.
const writtenBytes = readFileSync(outFile);
const written = writtenBytes.toString("utf8");
if (written !== LINE) {
  console.error("entry.txt does not match the line");
  process.exit(1);
}
if ([...written].length < 1 || [...written].length > 120) {
  console.error("entry.txt must be 1-120 characters");
  process.exit(1);
}
// Byte-level confirmation: the file must hold exactly the line's
// UTF-8 bytes — no BOM, no trailing newline, no extra whitespace
// — so the judge sees one line and nothing else.
const expectedBytes = Buffer.from(LINE, "utf8");
if (!writtenBytes.equals(expectedBytes)) {
  console.error("entry.txt bytes do not match the line exactly");
  process.exit(1);
}
