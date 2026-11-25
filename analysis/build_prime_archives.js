// Rebuild the derived prime archives for 1..60,000.
// Run from the repository root: node analysis/build_prime_archives.js
// Uses only Node.js built-ins. The sieve is the source of truth for this build.
const fs = require("node:fs");
const path = require("node:path");

const LIMIT = 60000;
const sieve = new Uint8Array(LIMIT + 1);
sieve.fill(1);
sieve[0] = 0;
sieve[1] = 0;
for (let p = 2; p * p <= LIMIT; p++) {
  if (!sieve[p]) continue;
  for (let n = p * p; n <= LIMIT; n += p) sieve[n] = 0;
}
const primes = [];
for (let n = 2; n <= LIMIT; n++) if (sieve[n]) primes.push(n);
if (primes.length !== 6057 || primes[0] !== 2 || primes.at(-1) !== 59999) {
  throw new Error(`Prime-list validation failed: count=${primes.length}, first=${primes[0]}, last=${primes.at(-1)}`);
}
const csv = rows => rows.map(row => row.map(v => v == null ? "" : String(v)).join(",")).join("\n") + "\n";
const features = [["prime","prime_index","gap_from_previous","gap_to_next","last_digit","residue_mod_30","residue_mod_210","block10_start","offset_in_10","block100_start","offset_in_100","block1000_start","offset_in_1000"]];
const gaps = [["prime_index","lower_prime","upper_prime","gap","midpoint"]];
for (let i = 0; i < primes.length; i++) {
  const p = primes[i], prev = primes[i - 1], next = primes[i + 1];
  features.push([p, i + 1, prev == null ? "" : p - prev, next == null ? "" : next - p, p % 10, p % 30, p % 210, Math.floor((p - 1) / 10) * 10 + 1, (p - 1) % 10, Math.floor((p - 1) / 100) * 100 + 1, (p - 1) % 100, Math.floor((p - 1) / 1000) * 1000 + 1, (p - 1) % 1000]);
  if (next != null) gaps.push([i + 1, p, next, next - p, (p + next) / 2]);
}
const residues = [["modulus","residue","prime_count","prime_cutoff_excluded"]];
for (const [modulus, cutoff] of [[30, 5], [210, 7]]) {
  const counts = new Map();
  for (const p of primes) if (p > cutoff) counts.set(p % modulus, (counts.get(p % modulus) || 0) + 1);
  for (const residue of [...counts.keys()].sort((a,b) => a-b)) residues.push([modulus, residue, counts.get(residue), cutoff]);
}
for (const [file, rows] of [
  ["data/prime_features_1_60000.csv", features],
  ["data/prime_gaps_1_60000.csv", gaps],
  ["data/prime_residue_counts_1_60000.csv", residues]
]) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, csv(rows), "utf8");
  console.log(`Wrote ${file}: ${rows.length - 1} data rows`);
}
console.log(`Validated ${primes.length} primes; ${gaps.length - 1} consecutive-prime gaps.`);
