#!/usr/bin/env python3
"""Reproduce Experiment 9 on the previously unused range 10,001–20,000.

Requires: numpy
Run: python analysis/independent_range_test.py
"""
from pathlib import Path
import csv
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "data" / "prime_counts_10001_20000_by_10.csv"
REPETITIONS = 100_000
SEED = 20_261_127


def load_clusters():
    with CSV_PATH.open(newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    counts = np.array([int(row["prime_count"]) for row in rows], dtype=int)
    if len(counts) != 1_000:
        raise ValueError(f"Expected 1,000 groups, found {len(counts)}")
    return counts.reshape(100, 10)


def total_absolute_change(values):
    return int(np.abs(values[:, 1:] - values[:, :-1]).sum())


def main():
    clusters = load_clusters()
    observed = total_absolute_change(clusters)
    rng = np.random.default_rng(SEED)
    shuffled_stats = np.empty(REPETITIONS, dtype=np.int16)
    for i in range(REPETITIONS):
        shuffled = np.array([rng.permutation(row) for row in clusters])
        shuffled_stats[i] = total_absolute_change(shuffled)
    exceed = int(np.sum(shuffled_stats >= observed))
    lo, median, hi = np.percentile(shuffled_stats, [2.5, 50, 97.5])
    print(f"Prime count in 10,001–20,000: {sum(map(sum, clusters))}")
    print(f"Observed total absolute change: {observed}")
    print(f"Shuffle mean: {shuffled_stats.mean():.5f}")
    print(f"Shuffle median: {median:.1f}")
    print(f"Central 95% shuffle interval: {lo:.1f} to {hi:.1f}")
    print(f"Shuffles >= observed: {exceed}/{REPETITIONS}")
    print(f"One-sided Monte Carlo p estimate (+1 correction): {(exceed + 1)/(REPETITIONS + 1):.8f}")
    print(f"Random seed: {SEED}")


if __name__ == "__main__":
    main()
