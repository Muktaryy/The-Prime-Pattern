#!/usr/bin/env python3
"""Experiment 12: phase-preserving shuffle test modulo 30.

Within each 1,000-number cluster, shuffle block counts only among blocks
whose starting integers have the same residue modulo 30. The phase groups
are recalculated for every cluster (the cluster start shifts by 1,000).
"""
from pathlib import Path
import csv
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
FILES = {
    "1-10000": (ROOT / "data" / "prime_counts_by_10.csv", 1),
    "10001-20000": (ROOT / "data" / "prime_counts_10001_20000_by_10.csv", 10001),
    "20001-30000": (ROOT / "data" / "prime_counts_20001_30000_by_10.csv", 20001),
}
REPETITIONS = 100_000
SEEDS = {"1-10000": 20261201, "10001-20000": 20261202, "20001-30000": 20261203}


def load_counts(path):
    with path.open(newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    counts = np.array([int(row["prime_count"]) for row in rows], dtype=np.int16)
    if len(counts) != 1000:
        raise ValueError(f"Expected 1,000 blocks in {path}")
    return counts.reshape(10, 100)


def run_test(name, start, groups):
    rng = np.random.default_rng(SEEDS[name])
    observed = int(np.abs(np.diff(groups, axis=1)).sum())
    phase_groups = []
    for cluster in range(10):
        block_starts = start + 10 * (cluster * 100 + np.arange(100))
        phases = block_starts % 30
        phase_groups.append([np.flatnonzero(phases == p) for p in np.unique(phases)])

    simulated = np.empty(REPETITIONS, dtype=np.int32)
    batch_size = 1000
    for first in range(0, REPETITIONS, batch_size):
        batch = min(batch_size, REPETITIONS - first)
        totals = np.zeros(batch, dtype=np.int32)
        for cluster in range(10):
            original = groups[cluster]
            shuffled = np.empty((batch, 100), dtype=np.int16)
            for indices in phase_groups[cluster]:
                order = np.argsort(rng.random((batch, len(indices))), axis=1)
                shuffled[:, indices] = original[indices][order]
            totals += np.abs(np.diff(shuffled, axis=1)).sum(axis=1)
        simulated[first:first + batch] = totals

    exceed = int(np.count_nonzero(simulated >= observed))
    low, median, high = np.quantile(simulated, [0.025, 0.5, 0.975], method="nearest")
    print(f"Range: {name}; primes: {int(groups.sum())}")
    print(f"Observed: {observed}; shuffle mean: {simulated.mean():.5f}")
    print(f"Median: {median}; central 95%: {low}–{high}")
    print(f"Exceedances: {exceed}/{REPETITIONS}; plus-one p: {(exceed + 1)/(REPETITIONS + 1):.8f}")
    print(f"Seed: {SEEDS[name]}\\n")


def main():
    for name, (path, start) in FILES.items():
        run_test(name, start, load_counts(path))


if __name__ == "__main__":
    main()
