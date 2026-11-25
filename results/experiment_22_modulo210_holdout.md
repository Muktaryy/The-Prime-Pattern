# Experiment 22 — Independent modulo-210 holdout test

Date: 2026-11-26  
Range: 70,001–80,000  
Data: 1,000 globally aligned blocks of ten; 902 primes total  
Simulation: 100,000 permutations per control

## Preregistered carry-forward design

This is the untouched range selected after Experiments 19–21. The statistic, 20 windows of 50 blocks, 960 primary transition pairs, 998 secondary full-sequence pairs, modulo-210 phase definition, two permutation controls, and plus-one p-value procedure were carried forward without tuning to this range.

For zero-based block index i, phase is the block's starting residue:
`(70001 + 10*i) mod 210`.
There are 21 phases. Global phase groups contain 47 or 48 blocks; within each 500-number window, phase groups contain 2 or 3 blocks.

- **22A (primary):** Shuffle observed counts globally within identical modulo-210 phases.
- **22B (sensitivity):** Shuffle counts within each 500-number window and modulo-210 phase.

## Data validation

The dataset contains exactly 1,000 ten-integer blocks and 902 primes. The first prime is 70,001 and the last is 79,999. The analysis script independently sieves the full range and verifies every stored block count.

## Observed statistic

| Statistic | a | x | b | y | Rate after +1 | Rate otherwise | Δ |
|---|---:|---:|---:|---:|---:|---:|---:|
| Windowed, 960 pairs (primary) | 214 | 101 | 746 | 230 | 0.47196 | 0.30831 | **0.16365** |
| Full sequence, 998 pairs (secondary) | 220 | 104 | 778 | 237 | 0.47273 | 0.30463 | **0.16810** |

## Results — primary windowed statistic

| Control | Mean Δ | Central 95% | Lower-tail p | Upper-tail p | Two-sided equal-tail p |
|---|---:|---:|---:|---:|---:|
| 22A global modulo-210 | 0.21442 | [0.14921, 0.27860] | 0.06335 | 0.93667 | **0.12670** |
| 22B within-window modulo-210 | 0.18574 | [0.12973, 0.24088] | 0.21644 | 0.78363 | **0.43288** |

## Secondary full-sequence results

| Control | Mean Δ | Central 95% | Lower-tail p | Upper-tail p | Two-sided equal-tail p |
|---|---:|---:|---:|---:|---:|
| 22A global modulo-210 | 0.21438 | [0.15056, 0.27726] | 0.07677 | 0.92324 | 0.15354 |
| 22B within-window modulo-210 | 0.18454 | [0.12905, 0.23926] | 0.27776 | 0.72235 | 0.55551 |

Seeds: 22A = 20261225; 22B = 20261226. Each control used 100,000 permutations. Tail estimates use the plus-one correction. Two-sided equal-tail p = min(1, 2 × min(lower-tail, upper-tail)).

## Interpretation

The observed primary Δ = 0.16365 is lower than the global phase-stratified null mean of 0.21442. However, the two-sided equal-tail p-value is approximately 0.1267, above the preselected 0.05 threshold. The within-window sensitivity control is also non-significant (p ≈ 0.4329).

**Conclusion:** In the untouched range 70,001–80,000, the locked modulo-210 conditional permutation tests do not detect a statistically significant departure in the specified transition statistic. The primary result trends lower than the global conditional null, but the evidence is insufficient to claim an effect.

This is not proof of independence and does not establish a general statement about primes. These are conditional permutation tests, not complete models of prime generation. The two controls condition on different amounts of local information, so their p-values answer related but distinct conditional questions.

## Reproducibility

Run from the repository root:

```bash
node analysis/experiment_22_modulo210_holdout.js
```

The script verifies the CSV against an independent sieve and runs both fixed-seed permutation controls.
