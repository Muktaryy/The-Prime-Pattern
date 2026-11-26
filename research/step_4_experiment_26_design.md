# Step 4 — Experiment 26 design: independent replication of the b=210, lag-3 result

Date: 2026-11-26  
Status: Design only. This protocol must be committed before generating or inspecting prime-count results for the new interval.

## 1. Research question

Does the positive b=210, lag-3 residual cross-product seen in Experiment 25 recur in a disjoint interval under the same finite conditioned random-sieve model?

This is a replication test of a model discrepancy, not a test of a new prime law.

## 2. Holdout interval and alignment

Use the half-open interval:

\[
[720511,\ 2820511)
\]

Its length is 2,100,000 = 10,000 × 210. The first integer is 1 modulo 210, and the interval is disjoint from Experiment 25's [300511,720511).

Use globally aligned blocks of length b=210:
- number of blocks M=10,000;
- block i is [720511+210i, 720511+210(i+1));
- all blocks share the same alignment as the prior b=210 experiment.

The prime list and block counts must be generated only after this protocol is committed.

## 3. Fixed primary model

Use the exact same finite conditioned random-sieve model as Experiment 25:
- cutoff z=613;
- \(\Theta_{613}=\prod_{p\le613}(1-1/p)\);
- integers not coprime to 210 are ineligible;
- for primes p≤613 dividing 210, fix forbidden residue a_p=0;
- for each p≤613 not dividing 210, draw one uniform forbidden residue modulo p per replicate, shared over the entire interval;
- independently retain each eligible survivor n with probability \(q_n=1/(\Theta_{613}\log n)\).

Use no parameter fitting or retuning. Verify every q_n is in (0,1]. Keep the same definition of the block mean \(\mu_i\) and exact finite-model block covariance \(K_i^{(3)}\) used in Experiment 25.

## 4. One primary statistic and test

For the 10,000 block counts \(C_i\), define residuals \(e_i=C_i-\mu_i\). The sole primary statistic is

\[
S_{210,3}=\frac{1}{M-3}\sum_{i=0}^{M-4}e_i e_{i+3}.
\]

The exact finite-model expectation is

\[
K_{210,3}=\frac{1}{M-3}\sum_{i=0}^{M-4}
\operatorname{Cov}_{model}(C_i,C_{i+3}).
\]

Run 5,000 simulations from the locked model. Compare the observed \(|S_{210,3}-K_{210,3}|\) with the simulated values using the same two-sided absolute-distance test and plus-one Monte Carlo p-value as Experiment 25.

Use fixed PRNG seed 20261129210. Report:
- observed S and analytic K;
- simulation mean, SD and Monte Carlo standard error of the mean;
- observed standardized discrepancy;
- exceedance count and plus-one p-value;
- a binomial confidence interval for the Monte Carlo tail probability.

There is one primary test, so no within-experiment Bonferroni correction is required. Do not add post-hoc primary tests or change to a one-sided tail.

## 5. Pre-specified descriptive diagnostics

These do not create additional significance tests:
1. Divide the 9,997 lag-3 pairs into four consecutive sections as evenly as possible. Report each section's mean observed residual product, mean analytic model covariance, and mean excess.
2. Report the mean residual count in each section.
3. Report the fraction of pair contributions with positive excess and the share of the net excess contributed by the largest 1% of absolute contributions.
4. Save the block counts and per-pair contributions so that concentration or drift can be inspected without selecting a new test after seeing the result.

Do not attach section-wise p-values or claim independent confirmation from these descriptive splits.

## 6. Data and implementation validation

- Independently generate the prime list with a segmented sieve and a second implementation.
- Record interval length, prime count, first and last prime.
- Verify that all 10,000 block counts sum to the independently verified prime total.
- Assert start alignment, block count, active-offset count \(\phi(210)=48\), and q_n≤1.
- Independently recompute the observed S and analytic K in a second implementation.
- Preserve the source code, validator, block-count data, machine-readable results, human-readable report, and all 5,000 simulated statistic values or an exact reproducible representation.

## 7. Interpretation rules

- If the statistic is again unusually positive, this is independent evidence that the specified z=613 model does not adequately describe this statistic in both tested intervals. It still does not establish a new prime law or reject all random-sieve/Hardy–Littlewood models.
- If the statistic is not unusual, Experiment 25 remains a real but unreplicated model discrepancy. The result would weaken the case for a stable recurring effect.
- If the statistic is unusual in the opposite direction, report that faithfully; do not change the test tail.
- A non-significant result is not proof that the model is true.
- The replication p-value is conditional on this pre-specified test. It does not retroactively correct the broader exploratory history across Experiments 23B, 24 and 25.

## 8. No changes after inspection

Do not change the interval, block length, lag, cutoff, thinning rule, seed, replicate count, statistic, or test tail after inspecting the new prime counts. Any alternative cutoff or revised model must be a separately documented future study with a new holdout interval.

## 9. Connection to Experiment 25

Experiment 25's primary anomaly was b=210, lag 3, with observed S=+0.3663240545, analytic K=-0.2027347202, standardized discrepancy +3.292, and two-sided Monte Carlo p=0.00079984 (Bonferroni-adjusted p=0.00719856 across its nine comparisons).

Experiment 26 asks only whether this specific discrepancy replicates under the unchanged model on new data.
