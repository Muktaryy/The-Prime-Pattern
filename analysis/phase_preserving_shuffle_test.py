#!/usr/bin/env python3
"""Experiment 12: phase-preserving shuffle test.

Prime counts are recorded in aligned blocks of 10. For primes greater than 5,
the number of possible prime candidates in a block depends strongly on its
starting residue modulo 30. This test preserves that modulo-30 phase.

Within each 1,000-number cluster, counts are shuffled only among block positions
with the same start % 30 (phases 1, 11, 21). The statistic remains the total
absolute adjacent change within the ten 1,000-number clusters.

Requires numpy. Run: python analysis/phase_preserving_shuffle_test.py
"""
from pathlib import Path
import csv
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
FILES = {
    "1-10000": ROOT / "data" / "prime_counts_by_10.csv",
    "10001-20000": ROOT / "data" / "prime_counts_10001_20000_by_10.csv",
    "20001-30000": ROOT / "data" / "prime_counts_20001_30000_by_10.csv",
}
REPETITIONS = 100_000
SEEDS = {
    "1-10000": 20_261_201,
    "10001-20000": 20_261_202,
    "20001-30000": 20_261_203,
}


def load_counts(path):
    with path.open(newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    counts = np.array([int(row["prime_count"]) for row in rows], dtype=np.int8)
    if len(counts) != 1_000:
        raise ValueError(f"{path}: expected 1,000 groups, got {len(counts)}")
    return counts.reshape(10, 100)


def statistic(groups):
    return int(np.abs(np.diff(groups, axis=1)).sum())


def run_test(name, groups):
    # Every cluster starts at the same modulo-30 phase pattern.
    starts = np.arange(1, 10_001, 10)
    phase_row = starts[:100] % 30
    phase_indices = [np.flatnonzero(phase_row == phase) for phase in (1, 11, 21)]

    observed = statistic(groups)
    rng = np.random.default_rng(SEEDS[name])
    simulated = np.empty(REPETITIONS, dtype=np.int16)
    for i in range(REPETITIONS):
        shuffled = groups.copy()
        for cluster in range(10):
            for indices in phase_indices:
                shuffled[cluster, indices] = rng.permutation(
                    shuffled[cluster, indices]
                )
        simulated[i] = statistic(shuffled)

    exceed = int(np.count_nonzero(simulated >= observed))
    low, median, high = np.percentile(simulated, [2.5, 50, 97.5])
    print(f"Range: {name}")
    print(f"Prime count: {int(groups.sum())}")
    print(f"Observed total absolute change: {observed}")
    print(f"Phase-preserving shuffle mean: {simulated.mean():.5f}")
    print(f"Median: {median:.1f}")
    print(f"Central 95% interval: {low:.1f} to {high:.1f}")
    print(f"Shuffles >= observed: {exceed}/{REPETITIONS}")
    print(f"One-sided Monte Carlo estimate (+1): {(exceed + 1)/(REPETITIONS + 1):.8f}")
    print(f"Seed: {SEEDS[name]}")
    print()


def main():
    for name, path in FILES.items():
        run_test(name, load_counts(path))


if __name__ == "__main__":
    main()
