#!/usr/bin/env node
"use strict";

// Experiment 15: modulo-210 candidates plus smoothly declining prime density.
// Run: node analysis/smooth_density_simulation.js

const fs = require("fs");
const path = require("path");

const FILES = [
  ["1–10,000", "data/prime_counts_by_10.csv", 1, 20261210],
  ["10,001–20,000", "data/prime_counts_10001_20000_by_10.csv", 10001, 20261211],
  ["20,001–30,000", "data/prime_counts_20001_30000_by_10.csv", 20001, 20261212],
];
const REPETITIONS = 100000;

function mulberry32(a) {
  return function () {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gcd(a, b) {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

function loadCounts(relativePath) {
  const lines = fs.readFileSync(path.join(__dirname, "..", relativePath), "utf8").trim().split(/\r?\n/);
  const values = lines.slice(1).map(line => Number(line.split(",")[2]));
  if (values.length !== 1000 || values.some(x => !Number.isInteger(x))) {
    throw new Error("Expected exactly 1,000 valid prime counts in " + relativePath);
  }
  return values;
}

function percentile(sorted, p) {
  return sorted[Math.floor((sorted.length - 1) * p)];
}

function run(name, counts, rangeStart, seed) {
  const random = mulberry32(seed);
  const candidates = [];
  let expectedPrimeCount = 0;

  for (let b = 0; b < 1000; b++) {
    const block = [];
    for (let n = rangeStart + 10 * b; n < rangeStart + 10 * b + 10; n++) {
      if (n === 2 || n === 3 || n === 5 || n === 7) {
        block.push({ probability: 1 });
        expectedPrimeCount += 1;
      } else if (n > 7 && gcd(n, 210) === 1) {
        const probability = 210 / (48 * Math.log(n));
        if (probability > 1) throw new Error("Probability exceeded 1 at n=" + n);
        block.push({ probability });
        expectedPrimeCount += probability;
      }
    }
    candidates.push(block);
  }

  let observed = 0;
  for (let w = 0; w < 20; w++) {
    for (let i = 1; i < 50; i++) {
      observed += Math.abs(counts[w * 50 + i] - counts[w * 50 + i - 1]);
    }
  }

  const simulated = new Array(REPETITIONS);
  let exceed = 0;
  let total = 0;
  const blockCounts = new Int16Array(1000);

  for (let r = 0; r < REPETITIONS; r++) {
    for (let b = 0; b < 1000; b++) {
      let count = 0;
      for (const candidate of candidates[b]) {
        if (random() < candidate.probability) count++;
      }
      blockCounts[b] = count;
    }

    let statistic = 0;
    for (let w = 0; w < 20; w++) {
      for (let i = 1; i < 50; i++) {
        statistic += Math.abs(blockCounts[w * 50 + i] - blockCounts[w * 50 + i - 1]);
      }
    }
    simulated[r] = statistic;
    total += statistic;
    if (statistic >= observed) exceed++;
  }

  simulated.sort((a, b) => a - b);
  console.log("Range: " + name);
  console.log("Actual prime count: " + counts.reduce((a, b) => a + b, 0));
  console.log("Model expected prime count: " + expectedPrimeCount.toFixed(5));
  console.log("Observed statistic: " + observed);
  console.log("Simulated statistic mean: " + (total / REPETITIONS).toFixed(5));
  console.log("Median: " + percentile(simulated, 0.5));
  console.log("Central 95% interval: " + percentile(simulated, 0.025) + " to " + percentile(simulated, 0.975));
  console.log("Simulations >= observed: " + exceed + "/" + REPETITIONS);
  console.log("One-sided Monte Carlo estimate (+1): " + ((exceed + 1) / (REPETITIONS + 1)).toFixed(8));
  console.log("Seed: " + seed + "\n");
}

for (const [name, file, start, seed] of FILES) {
  run(name, loadCounts(file), start, seed);
}
