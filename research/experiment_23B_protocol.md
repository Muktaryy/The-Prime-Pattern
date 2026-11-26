# Experiment 23B protocol — held-out aligned block covariance test

Date locked: 2026-11-26  
Status: Preregistered design. Do not inspect the held-out prime-count covariance results until this protocol and implementation are fixed.

## 1. Research question

Do actual prime counts in globally aligned blocks of length b=10, 30, and 210 show lag-1, lag-2, or lag-3 residual covariance inconsistent with the aligned finite random-sieve model, using a cutoff selected by the BFT-style density rule?

This is a test of a specified stochastic baseline, not a test of the Hardy–Littlewood conjecture itself and not a search for arbitrary patterns.

## 2. Held-out interval and alignment

Use the half-open integer interval
\[
[100171,200341).
\]
The start is 100171 ≡ 1 (mod 210), and the interval length is 100170=477×210. Therefore it is exactly aligned for all three block lengths:

- b=10: 10,017 blocks.
- b=30: 3,339 blocks.
- b=210: 477 blocks.

For each b, blocks are
\[
B_i^{(b)}=\{100171+ib,\ldots,100171+(i+1)b-1\}.
\]
This interval is above the previously analyzed prime data ending at 80,000. It is to be treated as a holdout for this experiment.

## 3. Principled finite-sieve cutoff

For each lower endpoint X=100171, define
\[
\Theta_z=\prod_{p\le z}(1-1/p)
\]
and choose z to be the largest prime satisfying
\[
\Theta_z\log X\ge1.
\]
This is the BFT-style cutoff condition, equivalently \(1/\Theta_z\le\log X\).

For this X:
- z=613.
- \(\Theta_{613}=0.08693500077318561\).
- \(\Theta_{613}\log X=1.0010247160915315\).
- The next prime is 617, for which the condition fails.
- The largest thinning probability, at n=X, is \(1/(\Theta_{613}\log X)=0.9989763328766421<1\).

The cutoff is fixed over the entire interval. It is not tuned separately by block or after seeing the prime data.

## 4. Null model

For each b separately:

1. Eligible integers satisfy gcd(n,b)=1. Ineligible integers have model indicator zero.
2. For every prime p≤613 dividing b, fix forbidden residue a_p=0.
3. For every prime p≤613 not dividing b, choose a_p uniformly from residues modulo p, independently across p. Each a_p is drawn once per replicate and shared over the entire interval.
4. An eligible n survives if it is not congruent to a_p modulo p for every p≤613 with p∤b.
5. Conditional on survival, retain n independently with probability
\[
q_n=\frac{1}{\Theta_{613}\log n}.
\]
6. The final indicator is Y_n; the simulated block count is \(C_i^{(b)}=\sum_{n\in B_i^{(b)}}Y_n\).

This is the aligned, conditioned finite random-sieve model specified in research/experiment_23_aligned_random_sieve_model.md. It is an adaptation of the BFT random-residue construction, not the original unconditioned BFT model.

## 5. Residuals and primary statistics

For each block, use the exact model marginal mean
\[
\mu_i^{(b)}=\frac{b}{\phi(b)}
\sum_{\substack{n\in B_i^{(b)}\\(n,b)=1}}\frac1{\log n}.
\]
For actual primes, let \(P_i^{(b)}\) be the observed prime count and define residual
\[
e_i^{(b)}=P_i^{(b)}-\mu_i^{(b)}.
\]

For each b and k∈{1,2,3}, compute the average centered lag product
\[
T_{b,k}=\frac1{N_{b,k}}\sum_{i=0}^{N_{b,k}-1}
\left(e_i^{(b)}e_{i+k}^{(b)}-
\operatorname{Cov}_{model}(C_i^{(b)},C_{i+k}^{(b)})\right),
\]
where \(N_{b,k}=M_b-k\), and the model covariance is calculated from the exact finite-cutoff pair formula, including the actual n-dependent logarithms.

The nine-dimensional vector of T values is the primary analysis. Its model expectation is zero, up to numerical precision.

## 6. Calibration and multiplicity

- Use 5,000 independent Monte Carlo replicates per b. Seeds fixed in the simulation source before execution: b=10 seed 2026112610; b=30 seed 2026112630; b=210 seed 2026112810. The seed values were present in source before running; they were added to this protocol's written record after the run (documentation deviation).
- Each replicate draws a fresh set of forbidden residues and fresh thinning coins; residue choices are shared across the full interval within that replicate.
- Estimate the mean and standard deviation of each of the nine T statistics from the simulations.
- Standardize each observed T by its corresponding Monte Carlo mean and standard deviation.
- Primary global statistic: maximum absolute standardized deviation across all nine (b,k) combinations.
- Calculate the global Monte Carlo p-value as (1 + number of simulated global maxima at least as large as observed)/(5,001).
- Report marginal two-sided Monte Carlo p-values for all nine statistics as descriptive secondary results. Do not select a lag or block length after seeing the results.
- Also report Monte Carlo standard errors and simulation quantiles. If the null distribution is visibly non-Gaussian, retain the empirical max-statistic calibration rather than relying on normal approximations.

## 7. Data and code validation

Before running the statistical comparison:

1. Independently generate the actual primes in the exact half-open interval using two methods (e.g. segmented sieve and deterministic trial-division spot checks).
2. Save raw prime list and exact block-count tables for b=10,30,210.
3. Validate each block-count total against an independent prime-count implementation.
4. Unit-test the cutoff calculation and confirm that 617 fails the cutoff condition.
5. Unit-test the model's marginal probabilities, pair probabilities, and block covariances against exact finite-product calculations.
6. Verify that every simulation replicate uses one shared forbidden residue per prime across the full interval, not independently per block.
7. Test the optimized simulation against a slow reference implementation on a smaller interval.
8. Keep the actual prime data hidden from model calibration and code tuning until all checks pass.

## 8. Interpretation rules

- A small global p-value means the observed nine-statistic covariance vector is unusual under this particular finite random-sieve model and its conditioning. It does not establish a new prime law.
- A non-small p-value means this test did not detect a departure; it does not prove the model is true or that primes are independent.
- A rejection may arise from omitted higher-prime residue structure, model cutoff, thinning assumptions, nonstationarity, or a genuine discrepancy. It must be investigated, not immediately called a discovery.
- The finite cutoff z=613 gives exact probabilities for this finite model. Replacing its truncated factors with infinite singular series is not part of this test.
- This experiment tests pairwise lag covariance only. It does not test the full joint distribution or higher-order correlations.

## 9. Files to create

- data/prime_counts_100171_200340_by_10_30_210.csv
- data/primes_100171_200340.csv
- analysis/experiment_23B_heldout_covariance.cpp
- results/experiment_23B_heldout_covariance.json
- results/experiment_23B_heldout_covariance.md

No result should be written until the data and implementation checks in Section 7 pass.

## Execution record

The holdout was analyzed after this protocol was committed. The source contained the three fixed seeds before execution, although the seed values were not explicitly listed in this protocol until this post-run documentation update. This is recorded as a minor preregistration documentation deviation; the seed values themselves were not selected based on the observed statistics.
