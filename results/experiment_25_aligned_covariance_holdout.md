# Experiment 25 — larger pre-registered holdout for aligned block covariance

Date: 2026-11-26  
Status: Completed; one pre-registered comparison rejects the specified finite model after multiplicity correction.

## 1. Protocol and holdout

The protocol was committed before generating or inspecting prime-count results for this interval. The half-open interval is [300511,720511), length 420000=2000×210. It is disjoint from Experiments 23B and 24.

- b=10: 42,000 blocks.
- b=30: 14,000 blocks.
- b=210: 2,000 blocks.
- All partitions begin at the same global alignment, with the lower endpoint 1 modulo 210.

The model, cutoff, lags, replicate count and test tails were fixed in the protocol. The finite sieve cutoff remained z=613, with Theta_613=0.08693500077318561 and Theta_613 log(300511)=1.09653199767709. The maximum thinning probability is 0.9119661, so all thinning probabilities are valid.

## 2. Data and independent checks

The interval contains 32,031 primes, first 300,511 and last 720,497. An independent segmented-sieve implementation reproduced the exact prime list, count and endpoints.

A second Python implementation independently recomputed the b=210, lag-3 observed statistic and analytic finite-model covariance:
- observed S = +0.366324054533264;
- analytic expectation K = −0.202734720239661.

Both agree with the C++ run to numerical precision. All block totals agree with the prime total.

## 3. Results

5,000 simulations were run for each b, using fixed seeds 2026112810, 2026112830 and 20261128210 for b=10,30,210 respectively.

| b | Lag | Analytic K | Observed S | Simulated mean S | Mean diagnostic z | Observed z | p |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 10 | 1 | -0.064495 | -0.063779 | -0.064474 | 0.684 | 0.329 | 0.7471 |
| 10 | 2 | -0.043890 | -0.043592 | -0.043856 | 1.112 | 0.138 | 0.8920 |
| 10 | 3 | 0.051530 | 0.051965 | 0.051523 | -0.193 | 0.175 | 0.8674 |
| 30 | 1 | -0.103463 | -0.094284 | -0.103521 | -0.392 | 0.881 | 0.3799 |
| 30 | 2 | -0.031613 | -0.022391 | -0.031594 | 0.132 | 0.878 | 0.3819 |
| 30 | 3 | -0.069731 | -0.053868 | -0.069693 | 0.252 | 1.520 | 0.1314 |
| 210 | 1 | -0.823815 | -0.708648 | -0.825129 | -0.554 | 0.686 | 0.4895 |
| 210 | 2 | -0.220927 | -0.423715 | -0.220303 | 0.261 | -1.197 | 0.2262 |
| 210 | 3 | -0.202735 | **+0.366324** | -0.203780 | -0.428 | **3.292** | **0.000800** |

The nine marginal p-values are shown exactly as tested; no lag or block size was selected after seeing the results.

## 4. Multiplicity and Monte Carlo uncertainty

The smallest marginal p-value is 0.00079984, for b=210 and lag 3. The pre-registered Bonferroni-adjusted p-value across all nine comparisons is **0.00719856**.

Only 3 of 5,000 simulated statistics were at least as extreme as the observed statistic under the two-sided test. The exact 95% binomial interval for the underlying simulation-tail probability is approximately [0.000124, 0.001752]. Multiplying the upper endpoint by nine gives a conservative Bonferroni-scaled endpoint of approximately 0.0158, still below 0.05. This interval reflects Monte Carlo tail-estimation uncertainty, not uncertainty from sampling new prime intervals.

The simulated mean for this statistic is within 0.43 Monte Carlo standard errors of the analytic K. Thus, the discrepancy is not explained by an evident mismatch between the simulator's mean and the analytic covariance formula.

## 5. Interpretation

**This interval provides evidence against the specified z=613 finite conditioned random-sieve model for the b=210, lag-3 residual covariance statistic.** The observed statistic is positive, while the model's expectation is negative, and the discrepancy remains significant after the nine-test Bonferroni correction.

This does not establish a new prime law. The rejection could reflect limitations of the finite cutoff, the random-residue conditioning, finite-interval phase effects, or another aspect of the model. The two earlier intervals were compatible with the model, so the result is not yet a stable general pattern. It is a model discrepancy requiring diagnosis and independent replication.

Do not change the model and retest this same interval as if it were confirmatory. Any revised model must be motivated and documented separately, and tested on a new holdout interval. The original Experiment 25 result must remain visible.

## 6. Reproducibility

- Protocol: research/experiment_25_protocol.md
- C++ simulation source: analysis/experiment_25_aligned_covariance_holdout.cpp
- Independent Python validation: analysis/validate_experiment_25_independent.py
- Prime list: data/primes_300511_720510.csv
- Block counts: data/prime_counts_300511_720510_by_10_30_210.csv
- Machine-readable results: results/experiment_25_aligned_covariance_holdout.json

The simulation was run locally using C++17 with g++ -O3 -std=c++17. A separate Python implementation independently reproduced the prime list and the decisive observed statistic and analytic covariance. The committed C++ source records the simulation algorithm, fixed parameters and seeds.
