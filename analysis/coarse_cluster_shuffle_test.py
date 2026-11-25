#!/usr/bin/env python3
"""Experiment 10: coarse-cluster shuffle test on two ranges.

Randomizes the 100 block-counts within each 1,000-number cluster.
This preserves broad local prime density while testing finer ordering.
Requires numpy. Run: python analysis/coarse_cluster_shuffle_test.py
"""
from pathlib import Path
import csv
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
FILES = {
    "1-10000": ROOT / "data" / "prime_counts_by_10.csv",
    "10001-20000": ROOT / "data" / "prime_counts_10001_20000_by_10.csv",
}
REPETITIONS = 100_000
SEEDS = {"1-10000": 20_261_128, "10001-20000": 20_261_129}


def load_clusters(path):
    with path.open(newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    counts = np.array([int(row["prime_count"]) for row in rows], dtype=np.int8)
    if len(counts) != 1_000:
        raise ValueError(f"{path}: expected 1,000 groups, got {len(counts)}")
    # Ten clusters, each covering 1,000 integers and containing 100 blocks of 10.
    return counts.reshape(10, 100)


def statistic(groups):
    return int(np.abs(np.diff(groups, axis=1)).sum())


def run_test(name, groups):
    observed = statistic(groups)
    rng = np.random.default_rng(SEEDS[name])
    simulated = np.empty(REPETITIONS, dtype=np.int16)
    for i in range(REPETITIONS):
        shuffled = np.stack([rng.permutation(row) for row in groups])
        simulated[i] = statistic(shuffled)
    exceed = int(np.count_nonzero(simulated >= observed))
    low, median, high = np.percentile(simulated, [2.5, 50, 97.5])
    print(f"Range: {name}")
    print(f"Prime count: {int(groups.sum())}")
    print(f"Observed total absolute change: {observed}")
    print(f"Shuffle mean: {simulated.mean():.5f}")
    print(f"Shuffle median: {median:.1f}")
    print(f"Central 95% interval: {low:.1f} to {high:.1f}")
    print(f"Shuffles >= observed: {exceed}/{REPETITIONS}")
    print(f"Plus-one Monte Carlo estimate: {(exceed + 1)/(REPETITIONS + 1):.8f}")
    print(f"Seed: {SEEDS[name]}")
    print()


def main():
    for name, path in FILES.items():
        run_test(name, load_clusters(path))


if __name__ == "__main__":
    main()
