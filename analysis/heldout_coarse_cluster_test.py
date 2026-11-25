#!/usr/bin/env python3
"""Experiment 11: pre-specified coarse-cluster test on 20,001–30,000.

Each 1,000-number cluster contains 100 counts (one per 10-number block).
Shuffle those 100 counts independently within each cluster, then compare
the total absolute adjacent change with the observed order.
Requires numpy. Run: python analysis/heldout_coarse_cluster_test.py
"""
from pathlib import Path
import csv
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "data" / "prime_counts_20001_30000_by_10.csv"
REPETITIONS = 100_000
SEED = 20_261_130


def load_clusters():
    with CSV_PATH.open(newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    counts = np.array([int(row["prime_count"]) for row in rows], dtype=np.int8)
    if len(counts) != 1_000:
        raise ValueError(f"Expected 1,000 groups, found {len(counts)}")
    return counts.reshape(10, 100)


def statistic(groups):
    return int(np.abs(np.diff(groups, axis=1)).sum())


def main():
    clusters = load_clusters()
    observed = statistic(clusters)
    rng = np.random.default_rng(SEED)
    simulated = np.empty(REPETITIONS, dtype=np.int16)
    for i in range(REPETITIONS):
        shuffled = np.stack([rng.permutation(row) for row in clusters])
        simulated[i] = statistic(shuffled)
    exceed = int(np.count_nonzero(simulated >= observed))
    low, median, high = np.percentile(simulated, [2.5, 50, 97.5])
    print(f"Prime count in 20,001–30,000: {int(clusters.sum())}")
    print(f"Observed total absolute change: {observed}")
    print(f"Shuffle mean: {simulated.mean():.5f}")
    print(f"Shuffle median: {median:.1f}")
    print(f"Central 95% shuffle interval: {low:.1f} to {high:.1f}")
    print(f"Shuffles >= observed: {exceed}/{REPETITIONS}")
    print(f"One-sided Monte Carlo estimate (+1 correction): {(exceed + 1)/(REPETITIONS + 1):.8f}")
    print(f"Random seed: {SEED}")


if __name__ == "__main__":
    main()
