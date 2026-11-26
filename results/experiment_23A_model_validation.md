# Experiment 23A — finite aligned random-sieve validation

Date: 2026-11-26  
Status: Simulation validation passed at the planned diagnostic level. This validates the implementation against the finite model's exact formulas; it is not a test of actual primes.

## Configuration

- Block lengths: b = 10, 30, 210.
- Alignment: a0 = 1; each run begins at the first integer at least 1,000,000 congruent to 1 modulo b.
- Eight consecutive blocks per run.
- Finite sieve cutoff: z = 31.
- Theta_31 = 0.15285215138898609.
- 200,000 independent model replications per block length.
- PRNG: Mulberry32, seed 20261126.
- For p|b, forbidden residue is fixed at 0. For p≤31 and p∤b, one uniform forbidden residue is drawn per prime and shared across the full eight-block run.
- Surviving eligible integers are independently retained with probability 1/(Theta_31 log n).
- The largest thinning probability is below 0.474, so every thinning probability is valid.

## Results

### One-point and pair checks

Across the eight blocks, maximum absolute block-mean errors were:
- b=10: 0.00225; maximum standardized mean discrepancy 1.33.
- b=30: 0.00663; maximum standardized mean discrepancy 2.50.
- b=210: 0.01379; maximum standardized mean discrepancy 2.07.

Three selected eligible pairs were checked for each b. Their empirical joint frequencies agreed with exact finite-model probabilities within 2.01 binomial Monte Carlo standard errors in all nine checks. The largest absolute pair z-score was 2.009 (b=30, shift d=60).

### Lagged block covariance

Empirical covariances are averages over all available block pairs at each lag. Exact-model values are computed by summing the exact finite-cutoff indicator covariances. Batch Monte Carlo standard errors use 200 independent batches of 1,000 replications.

| b | Lag | Empirical covariance | Exact model covariance | Batch MC SE | z |
|---:|---:|---:|---:|---:|---:|
| 10 | 1 | -0.055426 | -0.055156 | 0.000444 | -0.61 |
| 10 | 2 | -0.037149 | -0.036497 | 0.000501 | -1.30 |
| 10 | 3 | +0.050292 | +0.049910 | 0.000626 | +0.61 |
| 30 | 1 | -0.064891 | -0.064464 | 0.001306 | -0.33 |
| 30 | 2 | -0.002895 | -0.002972 | 0.001240 | +0.06 |
| 30 | 3 | -0.054221 | -0.056722 | 0.001425 | +1.75 |
| 210 | 1 | -0.286584 | -0.283614 | 0.007814 | -0.38 |
| 210 | 2 | -0.024949 | -0.033370 | 0.008828 | +0.95 |
| 210 | 3 | -0.044366 | -0.046668 | 0.008825 | +0.26 |

All nine lag-covariance discrepancies are within 1.76 batch Monte Carlo standard errors. The model simulation therefore reproduces its exact pair and block-covariance calculations to the expected Monte Carlo precision.

## Interpretation and limitations

1. This is a validation of the **finite z=31 random-sieve model**, not evidence about the actual primes.
2. The finite model includes only primes p≤31 in its random sieve. It must not be confused with the infinite singular series or the full Hardy–Littlewood prediction.
3. Pair checks and block covariances are not independent diagnostics: they are calculated from the same simulated replications. Their role is implementation verification.
4. Eight blocks per replication are enough for a small correctness test, not for estimating long-range behavior or statistical power.
5. The model has now passed its first implementation check. Before using it as a null for actual prime data, we should add independent unit tests for the finite-product factorization and compare a second implementation (for example, a small exact enumerator on a toy modulus) against this simulation.

## Files

- analysis/experiment_23_model_check.js
- results/experiment_23A_model_validation.json
- research/experiment_23_aligned_random_sieve_model.md

No comparison with observed prime counts was performed.
