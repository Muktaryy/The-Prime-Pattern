#!/usr/bin/env node
"use strict";

// Experiment 14: 500-integer local windows, preserving modulo-210 phase.
// Run: node analysis/fine_window_modulo210_test.js

const fs = require("fs");
const path = require("path");

const FILES = [
  ["1–10,000", "data/prime_counts_by_10.csv", 1, 20261207],
  ["10,001–20,000", "data/prime_counts_10001_20000_by_10.csv", 10001, 20261208],
  ["20,001–30,000", "data/prime_counts_20001_30000_by_10.csv", 20001, 20261209],
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

function test(name, counts, rangeStart, seed) {
  const windows = [];
  let observed = 0;
  for (let w = 0; w < 20; w++) {
    const vals = counts.slice(w * 50, (w + 1) * 50);
    for (let i = 1; i < 50; i++) observed += Math.abs(vals[i] - vals[i - 1]);

    const byPhase = new Map();
    for (let i = 0; i < 50; i++) {
      const phase = (rangeStart + (w * 50 + i) * 10) % 210;
      if (!byPhase.has(phase)) byPhase.set(phase, []);
      byPhase.get(phase).push(i);
    }
    windows.push({ vals, phaseGroups: [...byPhase.values()] });
  }

  const random = mulberry32(seed);
  const simulated = new Array(REPETITIONS);
  let exceed = 0;
  let total = 0;

  for (let r = 0; r < REPETITIONS; r++) {
    let statistic = 0;
    for (const window of windows) {
      const shuffled = window.vals.slice();
      for (const indices of window.phaseGroups) {
        for (let j = indices.length - 1; j > 0; j--) {
          const k = Math.floor(random() * (j + 1));
          const a = indices[j], b = indices[k];
          [shuffled[a], shuffled[b]] = [shuffled[b], shuffled[a]];
        }
      }
      for (let i = 1; i < 50; i++) {
        statistic += Math.abs(shuffled[i] - shuffled[i - 1]);
      }
    }
    simulated[r] = statistic;
    total += statistic;
    if (statistic >= observed) exceed++;
  }

  simulated.sort((a, b) => a - b);
  console.log("Range: " + name);
  console.log("Prime count: " + counts.reduce((a, b) => a + b, 0));
  console.log("Observed statistic: " + observed);
  console.log("Shuffle mean: " + (total / REPETITIONS).toFixed(5));
  console.log("Median: " + percentile(simulated, 0.5));
  console.log("Central 95% interval: " + percentile(simulated, 0.025) + " to " + percentile(simulated, 0.975));
  console.log("Shuffles >= observed: " + exceed + "/" + REPETITIONS);
  console.log("One-sided Monte Carlo estimate (+1): " + ((exceed + 1) / (REPETITIONS + 1)).toFixed(8));
  console.log("Seed: " + seed + "\n");
}

for (const [name, file, start, seed] of FILES) {
  test(name, loadCounts(file), start, seed);
}
