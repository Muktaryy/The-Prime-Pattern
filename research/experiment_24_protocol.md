# Experiment 24 — independent interval replication of aligned block covariance

Date locked: 2026-11-26
Status: Protocol committed before generating or inspecting prime-count results for this interval.

## Question
Does the aligned finite conditioned random-sieve model remain compatible with observed prime-count residual covariances at block lengths b=10,30,210 and lags k=1,2,3 in a second interval disjoint from Experiment 23B?

## Interval and alignment
Use [200341,300511), half-open, length 100170=477×210. The lower endpoint satisfies 200341 ≡ 1 (mod 210), and (200341−1) is divisible by 10, 30 and 210. Thus the partitions are globally aligned:
- b=10: 10017 blocks
- b=30: 3339 blocks
- b=210: 477 blocks

This interval does not overlap Experiment 23B [100171,200341). It is a replication, not a fully untouched research direction: the model, statistics and parameter choices were developed using the earlier interval.

## Fixed model
Retain z=613 from Experiment 23B for comparability; do not reselect it after examining this interval. Let Theta_613=product over p≤613 of (1−1/p). For each b:
1. Integers not coprime to b are ineligible.
2. For p≤613 dividing b, fix forbidden residue a_p=0.
3. For p≤613 not dividing b, draw one uniform forbidden residue modulo p per replicate, shared over the entire interval.
4. An eligible n surviving every forbidden class is retained independently with probability q_n=1/(Theta_613 log n).
5. Reject the run if any q_n is outside (0,1].

This is the same alignment-conditioned finite random-sieve model as Experiment 23B, an adaptation inspired by the BFT random-residue construction, not the original BFT theorem.

## Means, covariance and statistics
For each block B_i^(b), use
mu_i=(b/phi(b)) sum over n in B_i with gcd(n,b)=1 of 1/log n.

For k=1,2,3 define the raw residual cross-product average
S_(b,k)=1/(M_b−k) sum_i (P_i−mu_i)(P_(i+k)−mu_(i+k)).
Compute its exact finite-model expectation
K_(b,k)=1/(M_b−k) sum_i Cov_model(C_i,C_(i+k))
using the finite product over p≤613, with the actual logarithms at each integer.

The tested centered statistic is S−K. For each b,k, compare |S_observed−K| against |S_simulated−K| in 5,000 simulations. Report the exact K, observed S, simulated mean S, simulated SD, simulation-mean diagnostic (mean(S_sim)−K)/(SD/sqrt(5000)), observed standardized discrepancy (S_obs−K)/SD, and two-sided plus-one Monte Carlo p-value.

## Multiplicity
Nine marginal tests (3 block lengths × 3 lags). Report Bonferroni-adjusted minimum p-value. Do not construct a global maximum-statistic p-value from independent b-specific simulation streams. No post-hoc lag selection.

## Seeds
Use fixed seeds: b=10: 2026112710; b=30: 2026112730; b=210: 2026112810. These are recorded here before calculating the actual prime counts for this interval.

## Validation
- Generate primes with an independent sieve implementation and record count, first and last prime.
- Assert interval length and alignment for all b.
- Assert active-offset count equals phi(b), every q_n is in (0,1], all pair differences are in range, and each block table sums to the independently validated prime total.
- Verify simulated means against analytic K; report diagnostics rather than suppressing discrepancies.
- Preserve the original output and all nine marginal results.

## Interpretation
This is a replication of one model comparison on a second non-overlapping interval. A non-significant result means only that these nine statistics did not detect a departure from this finite model. It does not prove independence, the model, a prime law, or the full Hardy–Littlewood conjecture. If either interval shows a small p-value, treat it as a discrepancy requiring independent diagnosis and another pre-specified holdout, not as a discovery.

## Deviations
Any code, seed, parameter or analysis changes after looking at prime counts must be recorded explicitly. Do not change z, block lengths, lags, interval, simulation count or test tails after inspecting the data.
