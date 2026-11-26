# Step 3 — Investigation of Experiment 25

Date: 2026-11-26  
Status: Diagnostic review completed; Experiment 25 remains unchanged.

## 1. Primary result

Experiment 25 tested nine pre-specified residual cross-product statistics for block lengths b=10,30,210 and lags k=1,2,3 in [300511,720511). The finite conditioned random-sieve model used cutoff z=613 and 5,000 simulations per block length.

The b=210, lag-3 result was:
- observed raw residual cross-product S = +0.366324054533264;
- analytic finite-model expectation K = -0.202734720239661;
- simulated mean = -0.203779866181456;
- simulation SD = 0.172853026766081;
- observed standardized discrepancy = +3.29215;
- 3 of 5,000 simulated values were at least as far from K as the observed value;
- plus-one two-sided Monte Carlo p = 4/5001 = 0.00079984;
- Bonferroni-adjusted p across nine pre-specified comparisons = 0.00719856.

The eight other marginal comparisons were not significant. The interval contains 32,031 primes, from 300,511 through 720,497; an independent segmented sieve confirmed the count and endpoints.

## 2. Source and calculation audit

The committed protocol fixes the interval, alignment, model cutoff, thinning rule, lags, replicate count, seeds and two-sided tail before inspecting the holdout counts.

The C++ source:
- checks interval length and alignment for all three block lengths;
- checks active offset count equals phi(b);
- checks every thinning probability is in (0,1];
- computes the analytic block covariance from the finite local product;
- calculates observed and simulated statistics using the same residual means;
- compares the observed statistic to the exact analytic expectation K;
- reports simulated means and their Monte Carlo standard-error diagnostics;
- uses nine marginal tests with Bonferroni correction, not an invalid joint maximum test from independent streams.

The independent Python validator separately reproduces the prime count, endpoints, b=210 lag-3 observed statistic and analytic covariance. It does not independently validate all nine cells. The C++ program contains the full simulation; raw 5,000-draw arrays were not archived, so exact audit replay requires rerunning from the saved code and seeds.

No clear indexing, alignment, or arithmetic defect was identified in the reviewed implementation. This does not prove the stochastic model is appropriate for actual primes.

## 3. Additional descriptive decomposition

The b=210, lag-3 sequence contains 1,997 adjacent block-pair products. A post-hoc descriptive split into four consecutive sections gives the following mean observed residual product, mean model covariance, and their difference:

| Section | Pairs | Mean observed product | Mean model covariance | Mean excess |
|---|---:|---:|---:|---:|
| 1 | 500 | +0.58231 | -0.21354 | +0.79585 |
| 2 | 500 | +0.55616 | -0.20504 | +0.76120 |
| 3 | 500 | -0.12746 | -0.19867 | +0.07121 |
| 4 | 497 | +0.45481 | -0.19364 | +0.64845 |

All four section averages have positive excess, although the third is small. This suggests the full discrepancy is not attributable solely to one section. The split was chosen after seeing the result and is descriptive only; no section-wise significance claims are made.

There are 1,101 of 1,997 pair contributions whose observed residual product exceeds its model covariance. The largest 1% by absolute excess contribute about 29% of the net excess, so a minority of relatively large block-pair products contribute materially, but they do not account for the entire result.

The mean residual count per block is close to zero over the full interval (about -0.0044), so a simple overall prime-count level mismatch does not explain the result. The section residual means vary, however, and local density variation remains a possible issue requiring a model-based diagnostic.

## 4. What the result means

Supported conclusion:

**In this one independent interval, the b=210, lag-3 residual cross-product is unusually positive relative to the specified finite z=613 conditioned random-sieve model.**

Not established:
- a new law of prime numbers;
- a stable positive lag-3 correlation across intervals;
- failure of Hardy–Littlewood;
- failure of every random-sieve model;
- a reliable ability to predict future primes.

Experiments 23B and 24 did not show the same discrepancy. Therefore Experiment 25 is a model discrepancy that needs explanation and independent replication, not a discovery claim.

## 5. Main possible explanations to investigate

1. **Finite random-residue model limitation:** random forbidden residue classes are a modelling assumption; actual primes have the fixed forbidden class 0 for every small prime.
2. **Finite cutoff and thinning:** z=613 leaves larger-prime divisibility structure outside the sieve and uses independent thinning for survivors.
3. **Local variation:** the expected block mean is a smooth PNT-style approximation; residual local density fluctuations may contribute to lagged products.
4. **Tail calibration and model variability:** 5,000 simulations give a limited resolution for very small tail probabilities. The reported plus-one p-value and binomial uncertainty are retained; a larger simulation count can refine Monte Carlo precision but cannot repair a misspecified model.
5. **Ordinary interval-to-interval variability:** the earlier independent intervals were compatible with the model, so this may be a rare fluctuation rather than a persistent feature.

## 6. Next step within the project

Do not retune z, the thinning probabilities, or the statistic on this same interval and then call the result confirmatory. First formulate a diagnostic model review, including whether conditioning on the actual small-prime residue exclusions changes the expected covariance. Any revised model must be written down before testing a new holdout interval.

## Sources in the repository

- Protocol: research/experiment_25_protocol.md
- C++ source: analysis/experiment_25_aligned_covariance_holdout.cpp
- Independent validator: analysis/validate_experiment_25_independent.py
- Results: results/experiment_25_aligned_covariance_holdout.md
- Machine-readable results: results/experiment_25_aligned_covariance_holdout.json
