# Experiment 21 — Modulo-210 conditional permutation results

Date: 2026-11-26  
Range: 60,001–70,000  
Data: 1,000 globally aligned blocks of ten; 878 primes total  
Simulation: 100,000 permutations per control

## Design

Block index i is zero-based. The block beginning at 60,001 + 10i is assigned phase

`(60001 + 10i) mod 210`.

There are 21 distinct phases because 210 / gcd(210, 10) = 21. Across the 1,000 blocks, 13 phases contain 48 blocks and 8 phases contain 47 blocks.

Two conditional controls were tested:

- **21A (primary):** Shuffle observed counts globally, but only among positions with the same starting residue modulo 210.
- **21B (sensitivity):** Apply the same phase restriction separately inside each 500-number window. Each phase group within a window contains only 2 or 3 blocks.

The observed statistic is unchanged from Experiments 19–20. The primary statistic uses the 960 pairs fully inside the 20 windows. The secondary statistic uses all 998 consecutive transition pairs, including the 38 that cross window boundaries.

## Observed statistic

| Statistic | a | x | b | y | Rate after +1 | Rate otherwise | Δ |
|---|---:|---:|---:|---:|---:|---:|---:|
| Windowed, 960 pairs (primary) | 227 | 116 | 733 | 199 | 0.51101 | 0.27149 | **0.23953** |
| Full sequence, 998 pairs (secondary) | 235 | 121 | 763 | 209 | 0.51489 | 0.27392 | **0.24097** |

## Results — primary windowed statistic

| Control | Mean Δ | Central 95% | Upper-tail p | Two-sided equal-tail p |
|---|---:|---:|---:|---:|
| 21A global modulo-210 | 0.22796 | [0.16266, 0.29232] | 0.36509 | **0.73017** |
| 21B within-window modulo-210 | 0.23017 | [0.17602, 0.28357] | 0.36864 | 0.73727 |

## Secondary full-sequence results

| Control | Mean Δ | Central 95% | Upper-tail p | Two-sided equal-tail p |
|---|---:|---:|---:|---:|
| 21A global modulo-210 | 0.22795 | [0.16412, 0.29090] | 0.34605 | 0.69209 |
| 21B within-window modulo-210 | 0.22882 | [0.17605, 0.28090] | 0.32698 | 0.65395 |

Seeds: 21A = 20261223; 21B = 20261224. Each control used 100,000 permutations. Tail estimates use the plus-one correction. The two-sided equal-tail value is twice the smaller plus-one tail estimate, capped at 1.

## Interpretation

The observed Δ = 0.23953 is not unusual under the primary global modulo-210 control (two-sided p ≈ 0.7302). The within-window sensitivity control gives the same conclusion (p ≈ 0.7373).

**Conclusion:** After conditioning on the observed modulo-210 phase-specific block-count distributions, the sequential ordering in 60,001–70,000 does not show a statistically detectable departure from random ordering under the specified Δ statistic.

This is a conditional permutation result, not proof of independence and not a complete probabilistic model of primes. The within-window test has very small groups (2–3 blocks per phase per window), so it is a stringent local conditioning scheme and should be treated as a sensitivity analysis. Experiment 21 reuses the same range already examined in Experiments 19 and 20; it is exploratory, not an independent confirmation.

## Reproducibility

Run from the repository root:

```bash
node analysis/experiment_21_modulo210_test.js
```

The script validates all source counts against an independent sieve and reproduces both permutation controls.
