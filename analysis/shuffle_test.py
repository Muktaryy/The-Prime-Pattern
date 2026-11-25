#!/usr/bin/env python3
"""Reproduce the 1–10,000 prime-count and within-cluster shuffle analysis.

Requires: numpy
Run: python analysis/shuffle_test.py
"""
from pathlib import Path
import numpy as np

LIMIT = 10_000
BLOCK_SIZE = 10
CLUSTER_SIZE = 100
REPETITIONS = 20_000
SEED = 20_261_125


def prime_sieve(limit: int) -> np.ndarray:
    is_prime = np.ones(limit + 1, dtype=bool)
    is_prime[:2] = False
    for p in range(2, int(limit**0.5) + 1):
        if is_prime[p]:
            is_prime[p * p : limit + 1 : p] = False
    return is_prime


def main() -> None:
    is_prime = prime_sieve(LIMIT)
    counts = np.array([
        int(is_prime[start : start + BLOCK_SIZE].sum())
        for start in range(1, LIMIT + 1, BLOCK_SIZE)
    ])
    clusters = counts.reshape(-1, CLUSTER_SIZE // BLOCK_SIZE)

    # First differences within each 100-number cluster.
    differences = np.diff(clusters, axis=1)
    starts = differences[:, :-1].ravel()
    following = differences[:, 1:].ravel()

    plus_one = starts == 1
    observed_num = int(np.sum(following[plus_one] < 0))
    observed_den = int(plus_one.sum())
    other = ~plus_one
    other_num = int(np.sum(following[other] < 0))
    other_den = int(other.sum())

    observed = observed_num / observed_den

    # Independently shuffle the 10 block counts within each 100-number cluster.
    rng = np.random.default_rng(SEED)
    shuffled_stats = np.empty(REPETITIONS)
    for trial in range(REPETITIONS):
        shuffled = np.array([rng.permutation(row) for row in clusters])
        d = np.diff(shuffled, axis=1)
        first = d[:, :-1].ravel()
        second = d[:, 1:].ravel()
        mask = first == 1
        denominator = int(mask.sum())
        numerator = int(np.sum(second[mask] < 0))
        shuffled_stats[trial] = numerator / denominator if denominator else np.nan

    valid = shuffled_stats[~np.isnan(shuffled_stats)]
    print(f"Prime total: {int(is_prime.sum())}")
    print(f"Blocks of 10: {len(counts)}; clusters of 100: {len(clusters)}")
    print(f"+1 then negative: {observed_num}/{observed_den} = {observed:.6%}")
    print(
        f"Other starts then negative: {other_num}/{other_den} "
        f"= {other_num / other_den:.6%}"
    )
    print(f"Shuffle repetitions: {REPETITIONS}; seed: {SEED}")
    print(f"Mean shuffled proportion: {np.mean(valid):.6%}")
    lo, hi = np.percentile(valid, [2.5, 97.5])
    print(f"Central 95% shuffled interval: {lo:.6%} to {hi:.6%}")
    exceed = int(np.sum(valid >= observed))
    print(f"Shuffles >= observed: {exceed}/{len(valid)} = {exceed / len(valid):.6%}")


if __name__ == "__main__":
    main()
