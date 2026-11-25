# Review of Perplexity report: residual autocorrelation in prime counts

**Date:** 2026-11-26  
**Status:** Literature review audited; proposed experiment requires redesign before preregistration.  
**Project:** The Prime Pattern Project

## Executive assessment

The direction is mathematically worthwhile as a model-comparison exercise. It is not yet a plausible novelty claim. Prime counts in adjacent disjoint intervals inherit dependence from the Hardy–Littlewood prime-pair correlations, and the expected covariance can in principle be estimated from the singular series. The central question should therefore not be whether residual autocorrelation is zero, but whether observed block-count covariance/autocorrelation agrees with a specified arithmetic prediction.

Perplexity's report is useful as a starting bibliography, but its proposed experiment should **not** be implemented unchanged. In particular:

1. Montgomery–Soundararajan's variance statement concerns the von Mangoldt-weighted count `psi(x+H)-psi(x)`, in a growing-`H` regime and under strong conjectural input; it is not a direct theorem for raw prime counts in fixed blocks of length 10, 30, or 210.
2. The suggested finite-sieve independent-thinning null removes divisibility by small primes but does not model Hardy–Littlewood pair correlations among surviving candidates. Rejection would mean this null is inadequate, not that a new prime law has been found.
3. The sample-size recommendations are unsupported without a specified alternative effect size and a power calculation.
4. A residual standardized by `sqrt(mu_i)` is a Poisson residual, not automatically appropriate when the variance differs from the mean and neighboring counts have covariance.
5. The proposed ACF formula is a recognizable sample ACF convention, but its null distribution must be simulated under the full dependence model. Standardizing each residual by its marginal variance does not remove cross-correlation.

## 1. What the established theory actually says

### Montgomery–Soundararajan (2004)

Hugh L. Montgomery and Kannan Soundararajan, *Primes in Short Intervals*, Communications in Mathematical Physics 252 (2004), 589–617; first submitted to arXiv on 15 September 2004: https://arxiv.org/abs/math/0409258 and https://doi.org/10.1007/s00220-004-1222-4.

Their abstract studies the distribution of
`psi(x+H)-psi(x)`, where `psi` is the Chebyshev function, and develops evidence for an approximately normal distribution with mean about `H` and variance about
`H log(N/H)`, in a regime `N^delta <= H <= N^(1-delta)`. The argument is tied to strong forms of the Hardy–Littlewood prime-tuple conjectures. The paper's introduction and conjectures must be read carefully; do not describe the whole statement as an unconditional theorem.

**Correction:** This is not simply a proven variance formula for unweighted `pi(x+H)-pi(x)` at fixed `H=10,30,210`. Nor is its main conclusion an adjacent-interval autocorrelation theorem. It motivates studying variance and correlations, but does not directly validate the proposed finite-block test.

### Hardy–Littlewood prime-pair correlations

The Hardy–Littlewood prime-tuple conjecture predicts, for each fixed admissible set of distinct offsets, asymptotic frequencies governed by its singular series. For pairs, the conjectural average of `Lambda(n)Lambda(n+d)` is governed by the pair singular series. In prime-indicator language, the corresponding heuristic pair probability at scale `x` is approximately
`S(d)/(log x)^2`, for fixed nonzero offset `d`, with the usual local-factor interpretation.

For even `d`,
`S(d) = 2 C_2 product_{p|d, p>2} (p-1)/(p-2)`,
where `C_2 = product_{p>2}(1-1/(p-1)^2)`; for odd `d`, the pair is inadmissible and `S(d)=0`. These are conjectural asymptotic predictions, not exact pointwise probabilities for each integer.

This gives a direct mathematical route to expected covariance between counts in disjoint blocks. If
`C_i = sum_{r=1}^b X_{a_i+r}`,
then for two disjoint blocks the covariance is a sum over cross-block offsets of pair covariances. At a slowly varying scale near `x`, a first-order heuristic is
`Cov(X_n,X_{n+d}) approx (S(d)-1)/(log x)^2`,
and hence
`Cov(C_i,C_{i+k}) approx sum_{r=1}^b sum_{s=1}^b (S(kb+s-r)-1)/(log x)^2`,
with indexing adjusted to the chosen block endpoints. The marginal variance of a block also includes its diagonal Bernoulli terms and within-block pair terms. This approximation needs a careful derivation and finite-range error discussion before being used as a formal benchmark.

**Important implication:** A nonzero lag covariance is expected in Hardy–Littlewood-style models. “Residual autocorrelation equals zero” is not the correct universal mathematical null.

### Gallagher (1976)

P. X. Gallagher, *On the Distribution of Primes in Short Intervals*, Mathematika 23 (1976), 4–9. A source copy is indexed here: https://www.cambridge.org/core/services/aop-cambridge-core/content/view/DCE557AC8750333E68426FCEEC11858C/S0025579300016442a.pdf/on_the_distribution_of_primes_in_short_intervals.pdf

Gallagher showed that a suitable uniform version of the Hardy–Littlewood prime-tuple conjecture implies a Poisson limit for the number of primes in a randomly selected interval of length `h ~ lambda log N`, with fixed `lambda`. This is a conditional result. It does not directly describe fixed block lengths 10, 30, or 210 at ranges around one or ten million.

### Cramér and Granville

Cramér's independent Bernoulli model is a useful baseline: integers near `x` are independently selected with probability about `1/log x`. It predicts approximate independence for disjoint intervals, but it omits deterministic local congruence restrictions.

Andrew Granville's *Unexpected Irregularities in the Distribution of Prime Numbers* (Proceedings of the International Congress of Mathematicians, 1994 proceedings published 1995, vol. 1, pp. 388–399; DOI https://doi.org/10.1007/978-3-0348-9078-6_32) explains why small-prime divisibility changes Cramér-style predictions, especially for extreme gaps and local irregularities. A related accessible exposition is Granville, *Harald Cramér and the Distribution of Prime Numbers* (Scandinavian Actuarial Journal 1995, 1, 12–28): https://dms.umontreal.ca/~andrew/PDF/cramer.pdf.

The project's finite-sieve simulation accounts for candidate eligibility up to a chosen prime cutoff, but independent thinning of those candidates still omits pairwise and higher prime-tuple correlations.

### Maier and related short-interval work

Helmut Maier, *Primes in Short Intervals*, Michigan Mathematical Journal 32 (1985), no. 2, 221–225, DOI https://doi.org/10.1307/mmj/1029003189. Maier's theorem demonstrates irregularities in prime counts in certain short-interval regimes. It is not a theorem asserting a fixed lag autocorrelation for blocks of length 10, 30, or 210.

The broader Selberg-integral literature studies mean-square deviations of `psi` in short intervals. The standard Selberg-integral form is an integral over a forward interval such as `[x,2x]`; Perplexity's displayed limits `integral from 2x to x` are reversed and should be corrected. See the review *Prime numbers in almost all short intervals*: https://arxiv.org/pdf/2407.05651.pdf (check the paper's exact definitions and theorem hypotheses before quoting a result).

### Lemke Oliver–Soundararajan (2016)

Robert J. Lemke Oliver and Kannan Soundararajan, *Unexpected Biases in the Distribution of Consecutive Primes*, PNAS 113 (2016), no. 31, E4446–E4454, DOI https://doi.org/10.1073/pnas.1605366113; arXiv: https://arxiv.org/abs/1603.03720.

This is relevant evidence that arithmetic correlations between consecutive primes can be substantial and can be explained heuristically using Hardy–Littlewood. However, it studies residue-class patterns of consecutive primes, not autocorrelation of counts in fixed, consecutive integer blocks. It is related background, not the closest direct match.

### 2026 Poisson-tail paper

Abhishek Jha, *The Poisson Tail Conjecture for Primes in Short Intervals*, arXiv:2605.23014, submitted 21 May 2026: https://arxiv.org/abs/2605.23014.

The reference is real and current as of this review. It studies extensions and limitations of Poisson-tail predictions for intervals whose length is scaled by `lambda log x`, under a strong variant of Hardy–Littlewood. It is not a direct study of fixed-block residual autocorrelation. Cite it as recent context, not as the closest precedent.

## 2. Block-count covariance is the more natural first target

For non-overlapping blocks of length `b`, define
`C_i = sum_{r=0}^{b-1} X_{a_i+r}`, where `X_n=1` if `n` is prime and 0 otherwise.

The local mean is approximately
`mu_i = sum_{n in block i} 1/log(n)`,
or a more accurate integral/logarithmic-integral approximation. This handles the slowly changing density at first order.

But the covariance is not generally zero. Under a Hardy–Littlewood pair heuristic, for distinct positions separated by `d`,
`Cov(X_n,X_{n+d})` is approximately governed by the difference between the pair singular-series term and the product of the one-point densities. Summing those terms over pairs of positions gives the predicted covariance between block counts.

For lag `k`, the block separation is `kb`; the offsets in the covariance sum range over the cross-products of the two blocks. Thus block length 10, 30, and 210 all define mathematically meaningful statistics, but they probe different sums of singular-series terms. They should not be pooled or interpreted as interchangeable scales.

A useful first-stage target is therefore the vector
`(Var(C_i), Cov(C_i,C_{i+1}), Cov(C_i,C_{i+2}), Cov(C_i,C_{i+3}))`
as a function of block length and location. Convert these to correlations only after the variance model is specified.

## 3. Residuals and autocorrelation: recommended definitions

Let `mu_i` be the model's expected block count. Define the centered residual
`e_i = C_i - mu_i`.

If the null model gives marginal variances `v_i`, define
`z_i = e_i / sqrt(v_i)`.
Do not automatically set `v_i=mu_i`; that is a Poisson assumption. Also note that marginal standardization does not remove the null model's cross-covariance.

A conventional sample autocorrelation estimate is
`r_k = [sum_{i=1}^{M-k}(z_i-zbar)(z_{i+k}-zbar)]/[sum_{i=1}^{M}(z_i-zbar)^2]`.
This is a defensible descriptive statistic if the convention is fixed in advance. The null distribution of `r_k` must be obtained from simulations or a justified asymptotic theory matching the same block construction and dependence structure. Do not use the usual white-noise ACF confidence bands unless the null actually implies white noise.

Better still, compare the observed covariance vector directly with the model's predicted covariance vector, and calibrate a joint statistic by simulation. This avoids treating a nonzero Hardy–Littlewood-predicted covariance as a discovery.

## 4. Density and sieve corrections

The PNT approximation `1/log n` is a first-order local mean, not a complete finite-range stochastic model. For a finite sieve modulus `m`, one can define candidate eligibility
`A_m(n)=1[(n,m)=1]`
and use an intensity such as
`p_n = A_m(n) * c_m/log(n)`,
where `c_m` is calibrated consistently with the intended average density. This is a useful independent-thinning diagnostic.

However:
- It accounts for the deterministic removal of multiples of primes dividing `m`.
- It does not reproduce Hardy–Littlewood correlations between distinct eligible positions.
- Modulo 210 captures only primes 2, 3, 5, and 7; a finite sieve through 31 has a much longer combined residue period. Eligibility should be calculated for each integer, not assumed to be captured by modulo 210.
- For block length 210, every complete aligned block contains exactly 48 integers coprime to 210 (apart from endpoint conventions), but that does not make prime indicators independent within or across blocks.

## 5. Problems with Perplexity's proposed experiment

The suggested range 1,000,001–2,000,000 and replication range 2,000,001–3,000,000 are computationally reasonable for a first dataset, but no evidence is given that they provide useful power. Power depends on the smallest effect worth detecting and the covariance of the statistic under the chosen null. A large number of adjacent blocks is not the same as the same number of independent observations.

The proposal also says the primary hypothesis is that residual lag-1 autocorrelation is “not significantly different from zero,” while its alternative is “nonzero.” This is a test of departure from a chosen null, not a scientific explanation. A failure to reject does not establish zero autocorrelation or validate the whole model.

100,000 simulations can estimate a Monte Carlo tail probability reasonably well, but do not by themselves create statistical power in the observed prime data. Power needs separate simulations under explicit alternatives (for example, specified correlation magnitudes) and should include the complete model and all planned comparisons.

Finally, testing block lengths 10, 30, 210 and lags 1, 2, 3 creates a family of tests. Select one primary statistic and treat the rest as secondary, or use a joint/max-statistic simulation that accounts for the whole family.

## 6. Recommended design direction — not yet a preregistration

Do not code the proposed independent finite-sieve test as the definitive experiment. First write and independently review a mathematical specification with these stages:

1. **Descriptive data:** Generate exact prime indicators and non-overlapping block counts for fixed, globally aligned blocks of length 10, 30, and 210. Use at least two disjoint ranges, and report raw counts and density-adjusted summaries.
2. **Baseline A (Cramér):** Independent Bernoulli selection with probability approximately `1/log n`. This is a deliberately weak reference baseline.
3. **Baseline B (finite sieve):** Remove multiples of primes through 31 and independently thin eligible integers with a calibrated probability. Label this a finite-sieve independent model, not a full Granville or Hardy–Littlewood model.
4. **Arithmetic prediction:** Derive the expected within-block variance and lag-1 through lag-3 covariance from the Hardy–Littlewood pair singular series, under its conjectural assumptions. Be explicit about the averaging over block origins and the slowly varying `log n` factor.
5. **Primary statistic:** Prefer a predeclared covariance/correlation residual relative to the pair-singular-series prediction, not a test whose null expectation is automatically zero. Choose one block length and one lag as primary after power calculations.
6. **Calibration:** Simulate the statistic under Baselines A and B. For the Hardy–Littlewood benchmark, use the analytically derived covariance prediction and clearly label its conjectural status; do not invent a generative “Hardy–Littlewood simulation” unless a valid joint probability model is constructed.
7. **Power:** Before choosing sample sizes, specify minimum scientifically meaningful effect sizes and simulate them. Use separate integer ranges for design and holdout; do not tune the method on the holdout.
8. **Replication:** Repeat the frozen primary test on a second non-overlapping range. Correct for any predeclared family of block lengths/lags.

This design is falsifiable: the observed covariance vector can agree with or depart from the arithmetic prediction and from the simpler baselines. But it is more honest than interpreting any rejection of independent thinning as evidence of a novel pattern.

## 7. Bibliography audit

Reliable and relevant links:
- Montgomery & Soundararajan (2004), *Primes in Short Intervals*: https://arxiv.org/abs/math/0409258 ; https://doi.org/10.1007/s00220-004-1222-4
- Gallagher (1976), *On the Distribution of Primes in Short Intervals*: https://www.cambridge.org/core/services/aop-cambridge-core/content/view/DCE557AC8750333E68426FCEEC11858C/S0025579300016442a.pdf/on_the_distribution_of_primes_in_short_intervals.pdf
- Granville (1995), *Unexpected Irregularities in the Distribution of Prime Numbers*: https://doi.org/10.1007/978-3-0348-9078-6_32
- Granville (1995), *Harald Cramér and the Distribution of Prime Numbers*: https://dms.umontreal.ca/~andrew/PDF/cramer.pdf
- Maier (1985), *Primes in Short Intervals*: https://doi.org/10.1307/mmj/1029003189
- Lemke Oliver & Soundararajan (2016), *Unexpected Biases in the Distribution of Consecutive Primes*: https://arxiv.org/abs/1603.03720 ; https://doi.org/10.1073/pnas.1605366113
- Jha (2026), *The Poisson Tail Conjecture for Primes in Short Intervals*: https://arxiv.org/abs/2605.23014
- Zaccagnini et al., *Prime numbers in almost all short intervals* (survey/reference): https://arxiv.org/pdf/2407.05651.pdf

Perplexity's [9] and [10] entries do not reliably identify the Lemke Oliver–Soundararajan paper: the supplied Semantic Scholar link is titled as a Cramér prime-gap work, and the Dialnet link is a secondary record. Replace them with the arXiv and PNAS DOI above. The Scribd link listed for Cramér is not an appropriate primary scholarly reference. The Math StackExchange item is not a primary source.

## Final recommendation

**Proceed with the direction, but pause before coding.** The next deliverable should be a short mathematical design note deriving the block-count covariance predicted by the Hardy–Littlewood pair singular series for lags 1–3 and block lengths 10, 30, and 210. Ask Gemini to independently check that derivation and the proposed power plan. Only then freeze one primary experiment and implement it in JavaScript.

No novelty claim is justified by the current literature review. The project can still make a useful reproducible contribution by carefully measuring fixed-block covariance, comparing it with explicit arithmetic predictions, and documenting where simple models fail.
