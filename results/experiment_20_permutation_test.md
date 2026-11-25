# Experiment 20 — Conditional permutation results

Date: 2026-11-26  
Range: 60,001–70,000  
Data: 1,000 globally aligned blocks of ten; 878 primes total  
Simulation: 100,000 permutations per control; Mulberry32

## Validation

The input CSV contains exactly 1,000 block counts summing to 878. The analysis script independently sieves every integer in 60,001–70,000 and verifies that all 1,000 stored block counts match the sieve-generated counts.

Block phase is determined by the zero-based block index modulo 3. Since 60,001 ≡ 1 (mod 30), the candidate-slot capacities repeat 2, 4, 2.

## Observed statistic

| Statistic | a | x | b | y | Rate after +1 | Rate otherwise | Δ |
|---|---:|---:|---:|---:|---:|---:|---:|
| Windowed, 960 pairs (primary) | 227 | 116 | 733 | 199 | 0.51101 | 0.27149 | **0.23953** |
| Full sequence, 998 pairs (secondary) | 235 | 121 | 763 | 209 | 0.51489 | 0.27392 | **0.24097** |

The windowed statistic uses only pairs fully inside each 50-block window. The full-sequence statistic additionally includes the 38 pairs crossing the 19 window boundaries.

## Permutation results — primary windowed statistic

| Control | Null arrangement | Mean Δ | Central 95% | Upper-tail p | Two-sided equal-tail p |
|---|---|---:|---:|---:|---:|
| 20A diagnostic | Unrestricted global shuffle | 0.24026 | [0.17255, 0.30628] | 0.51172 | 0.97667 |
| 20B primary | Global shuffle within modulo-30 phase | 0.22763 | [0.16227, 0.29189] | 0.36009 | **0.72017** |
| 20C sensitivity | Shuffle within each 500-number window and phase | 0.23524 | [0.17139, 0.29818] | 0.44845 | 0.89689 |

## Secondary full-sequence results

| Control | Mean Δ | Central 95% | Upper-tail p | Two-sided equal-tail p |
|---|---:|---:|---:|---:|
| 20A diagnostic | 0.24029 | [0.17407, 0.30462] | 0.49426 | 0.98851 |
| 20B primary | 0.22763 | [0.16379, 0.29049] | 0.34028 | 0.68055 |
| 20C sensitivity | 0.23479 | [0.17261, 0.29667] | 0.42314 | 0.84627 |

All simulations produced defined statistics. Seeds: 20A = 20261220; 20B = 20261221; 20C = 20261222. Plus-one tail estimates use (r+1)/(100000+1). The two-sided equal-tail value is twice the smaller of the plus-one lower- and upper-tail estimates, capped at 1.

## Interpretation

The observed Δ = 0.23953 is not unusual under the primary 20B phase-stratified permutation null: its two-sided equal-tail p-value is approximately 0.7202. It is also not unusual under the within-window phase-stratified sensitivity control 20C (p ≈ 0.8969). The unrestricted diagnostic control 20A is likewise non-significant.

**Conclusion:** Conditional on the observed phase-specific block-count distributions modulo 30, the observed ordering in 60,001–70,000 does not show a statistically detectable departure from random ordering under the specified Δ statistic.

This is not proof that the counts are independent, and it does not establish or refute a general law about primes. These are conditional permutation tests, not complete models of prime generation. The modulo-30 control does not preserve modulo-210 or higher-prime residue structure. Experiment 20 is an exploratory follow-up on the same range already examined in Experiment 19, not a fresh blind confirmation.

## Reproducibility

Run from the repository root:

```bash
node analysis/experiment_20_permutation_test.js
```

The script validates the source CSV against an independent sieve, runs all three controls with 100,000 permutations each, and prints the complete machine-readable result.
