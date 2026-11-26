# Experiment 24 — independent interval replication of aligned block covariance

Date: 2026-11-26  
Status: Completed.

## 1. Protocol and interval

The protocol was committed before generating or inspecting prime-count results for this interval. The tested half-open interval is [200341,300511), length 100170=477×210. It is disjoint from Experiment 23B's [100171,200341).

- b=10: 10,017 blocks.
- b=30: 3,339 blocks.
- b=210: 477 blocks.
- All partitions begin at the same global alignment (lower endpoint 1 modulo 210).

The model, cutoff, lags, replicate count and test tails were carried over unchanged from Experiment 23B. The finite sieve cutoff is z=613, with Theta_613=0.0869350007731856 and Theta_613 log(200341)=1.06128303283538. The maximum thinning probability is therefore below 1.

## 2. Data validation

The interval contains 8,027 primes; first 200,341 and last 300,499. An independent Python segmented sieve returned the same count and endpoints. All three block-count datasets sum to 8,027.

## 3. Results

5,000 simulations were run for each b, using fixed seeds 2026112710, 2026112730 and 2026112810 for b=10,30,210 respectively.

| b | Lag | Analytic expectation K | Observed S | Simulated mean S | Mean diagnostic z | Observed z | p |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 10 | 1 | -0.071791 | -0.065813 | -0.071777 | 0.217 | 1.292 | 0.1938 |
| 10 | 2 | -0.048855 | -0.048130 | -0.048844 | 0.172 | 0.155 | 0.8722 |
| 10 | 3 | 0.057359 | 0.055317 | 0.057359 | 0.000 | -0.368 | 0.7197 |
| 30 | 1 | -0.115167 | -0.108800 | -0.114937 | 0.733 | 0.287 | 0.7790 |
| 30 | 2 | -0.035189 | -0.043234 | -0.034990 | 0.612 | -0.350 | 0.7359 |
| 30 | 3 | -0.077619 | -0.039289 | -0.077786 | -0.529 | 1.709 | 0.0902 |
| 210 | 1 | -0.917006 | -0.503181 | -0.911947 | 1.030 | 1.191 | 0.2360 |
| 210 | 2 | -0.245919 | -0.660327 | -0.244239 | 0.335 | -1.168 | 0.2402 |
| 210 | 3 | -0.225669 | -0.740394 | -0.230199 | -0.913 | -1.467 | 0.1478 |

The simulated means are all within 1.53 Monte Carlo standard errors of their analytic expectations. This is a useful check that the finite-model covariance calculation and simulator agree.

## 4. Multiplicity and interpretation

The smallest marginal p-value is 0.0902 (b=30, lag 3). The Bonferroni-adjusted p-value across all nine comparisons is 0.8116. No joint maximum-statistic p-value was computed.

There is no statistically significant departure from the specified finite conditioned random-sieve model in this interval. The b=30, lag-3 result is the closest to the conventional 0.05 threshold, but it is not significant even before multiplicity adjustment.

Taken together with Experiment 23B, this second non-overlapping interval also shows compatibility with the same model for the nine tested covariance statistics. This is replication across two intervals, not proof that the model is true, that primes are independent, or that the full Hardy–Littlewood conjecture holds. The test only covers b=10,30,210 and lags 1–3 under this particular finite cutoff and conditioning. The b=210 estimates are less precise because there are only 477 blocks. No formal power analysis was performed.

## 5. Reproducibility

- Protocol: research/experiment_24_protocol.md
- Source: analysis/experiment_24_aligned_covariance_replication.cpp
- Prime list: data/primes_200341_300510.csv
- Block counts: data/prime_counts_200341_300510_by_10_30_210.csv
- Machine-readable results: results/experiment_24_aligned_covariance_replication.json

The simulation was run locally using C++17 and g++ -O3 -std=c++17. A local implementation matching the committed source's algorithm, parameters and seeds generated the archived results. The GitHub Actions environment was not used.
