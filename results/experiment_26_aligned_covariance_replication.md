# Experiment 26 — Independent replication of the b=210, lag-3 result

Date: 2026-11-26  
Status: Completed; the Experiment 25 discrepancy did not replicate.

## 1. Locked protocol

The pre-registered interval was [720511,2820511), length 2,100,000, containing 10,000 globally aligned blocks of 210. It is disjoint from Experiment 25's interval. The test used the unchanged finite conditioned random-sieve model, cutoff z=613, 5,000 simulations and seed 20261129210. The sole primary statistic was the two-sided b=210, lag-3 residual cross-product test.

## 2. Independent data validation

An independent segmented-sieve implementation confirmed:
- prime count: 146,713;
- first prime: 720,527;
- last prime: 2,820,509;
- sum of the 10,000 block counts: 146,713;
- active offsets per block: phi(210)=48.

A separate Python implementation independently reproduced the observed statistic and exact finite-model expectation to numerical precision.

## 3. Primary result

| Quantity | Result |
|---|---:|
| Observed statistic S | -0.259775 |
| Analytic model expectation K | -0.170171 |
| Simulation mean | -0.170116 |
| Simulation SD | 0.074483 |
| Monte Carlo SE of simulation mean | 0.001053 |
| Observed standardized discrepancy | -1.203 |
| Two-sided exceedances | 1,126 / 5,000 |
| Plus-one Monte Carlo p-value | 0.225355 |
| 95% binomial interval for tail probability | [0.213685, 0.237037] |

The observed statistic is about 1.20 simulation standard deviations below the model expectation. It is not unusual under the pre-specified two-sided test. The simulation mean is close to the analytic expectation (about 0.052 Monte Carlo standard errors away).

## 4. Descriptive interval split

The 9,997 lag-3 pairs were split into four consecutive sections as pre-specified. Mean excess is observed residual product minus analytic model covariance.

| Section | Pairs | Mean observed product | Mean model covariance | Mean excess |
|---|---:|---:|---:|---:|
| 1 | 2,499 | -0.271734 | -0.183300 | -0.088434 |
| 2 | 2,499 | -0.284217 | -0.172223 | -0.111995 |
| 3 | 2,499 | -0.286749 | -0.165147 | -0.121602 |
| 4 | 2,500 | -0.196425 | -0.160017 | -0.036408 |

All four section averages have negative excess. This is descriptive only; no section-wise significance tests were performed. The overall residual count level is close to the model's total expected count; local section variation is visible but not a separately tested effect.

## 5. Conclusion

**Experiment 26 does not reproduce Experiment 25's unusually positive b=210, lag-3 result.** The new interval is compatible with the specified z=613 finite conditioned random-sieve model for this one pre-specified statistic.

This does not prove the model is true, establish independence, or settle prime correlations. Experiment 25 remains a genuine single-interval discrepancy under its stated test, but the absence of replication weakens the case for a stable recurring effect. The appropriate conclusion is that the earlier anomaly is currently unconfirmed.

The model is finite and conditioned; it is not the full Hardy–Littlewood conjecture or a proof of actual-prime statistics. This result should not be presented as proof that all prime patterns follow the model.

## 6. Reproducibility

- Locked protocol: research/step_4_experiment_26_design.md
- C++ simulation: analysis/experiment_26_aligned_covariance_replication.cpp
- Independent validator: analysis/validate_experiment_26_independent.py
- Machine-readable result: results/experiment_26_raw.json
- Descriptive diagnostics: results/experiment_26_diagnostics.csv

The simulation was run locally with g++ 14.2.0, C++17 and -O3. The 5,000 simulated draws are reproducible from the saved source and fixed seed; the independent Python validator recomputes the prime list, observed statistic and analytic expectation. The generated full prime list and per-block CSV are produced by the C++ source when run from the repository root.
