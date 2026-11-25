# Review of Perplexity literature report

Date: 2026-11-26

## Overall assessment

The report is a useful literature map and is appropriately cautious about novelty. Its main mathematical themes—Prime Number Theorem density, small-prime sieving, Cramér/Granville-style models, Maier's theorem, and Hardy–Littlewood prime tuples—are relevant to this project.

It should not be copied into the main literature review unchanged. A few experiment summaries conflate different tests, and some model descriptions need tighter wording.

## Corrections required

### 1. Modulo-210 phase experiment versus smooth-density experiment

The report says that preserving modulo-210 phase made the first two ranges statistically ordinary while the third remained high.

That does not match the repository's Experiment 14 results. The saved README reports:

- 1–10,000: upper-tail estimate 0.01152;
- 10,001–20,000: upper-tail estimate 0.02991;
- 20,001–30,000: upper-tail estimate 0.00056.

All three are below 0.05 as unadjusted exploratory tail estimates. The first two are less extreme than the third, but they should not be described as statistically ordinary. These are exploratory tests across examined ranges, so the nominal values also need multiple-testing caution.

The statement that all three observed statistics fell inside the simulated central 95% intervals belongs to Experiment 15, the separate smooth-density-plus-modulo-210 independent Bernoulli model. The report merges the Experiment 14 and Experiment 15 conclusions.

### 2. Be precise about the finite-sieve model

Experiments 17–18 exclude multiples of primes up to 31 and then independently select each survivor with probability

\[
p(n)=\frac{C}{\log n},\qquad C=\prod_{p\le31}\frac{p}{p-1}.
\]

This is a finite-sieve independent-residual model inspired by the logic of Cramér/Granville corrections. It is not the full Granville model, not the Banks–Ford–Tao random sieve model, and not a Hardy–Littlewood singular-series model. The existing project literature review already makes this distinction; preserve it in any revised report.

### 3. Experiment 19 density comparison

For 60,001–70,000, the saved Experiment 19 script uses the same finite-sieve probability. Summing its individual selection probabilities over eligible integers gives an expected selected count of approximately 900.36. The logarithmic-integral benchmark is approximately 902.45. The observed prime count is 878.

Thus, the report should not imply that the model exactly matches the observed count. It is a reasonable approximate density baseline for this interval, but the difference between expected and observed counts should be reported rather than hidden. This does not by itself invalidate the statistic comparison; the Monte Carlo test is unconditional under the specified model and should be interpreted as such.

### 4. Held-out range wording

Experiments 17 and 18 tested 40,001–50,000 and 50,001–60,000 using the same fixed finite-sieve model and statistic. The observed adjacent-change statistics were within the model's central 95% intervals and below the simulated means.

It is fair to call these two ranges held-out relative to the prior Experiment 15/16 development, as documented in the repository. The conclusion must remain narrow: these tests found no unusually large adjacent variation under that particular model and statistic in those two ranges. They do not establish that the model explains prime distribution generally.

### 5. Modulo structure wording

The modulo-30 and modulo-210 restrictions explain deterministic candidate-position structure. They can materially affect block-count distributions and the outcome of naïve shuffles. However, a phase-preserving shuffle is a conditional randomization test, not itself a complete probabilistic model of primes. Keep that distinction clear.

## What is sound and useful in the report

- The Prime Number Theorem explains the broad decline in average prime density, not individual prime positions or all short-range correlations.
- Cramér's independent model is a useful heuristic baseline but ignores local divisibility constraints.
- Small-prime sieving is essential when modelling candidate positions.
- Maier's theorem shows that short-interval prime counts can have irregularities relative to simple expectations; it does not directly prove anything about this project's exact block statistic.
- Hardy–Littlewood prime-tuple heuristics are relevant to correlations at prescribed offsets, but they are conjectural in general and are not implemented by our current simulations.
- The exact 10-block transition statistic should be searched in the literature before any novelty claim.

## Recommended corrected summary for the project

The project studies a known broad subject: local prime-count fluctuations and arithmetic correlations. Experiments show that naïve shuffles can mistake small-prime residue structure for unusual ordering. A modulo-210 independent-density baseline explained the observed scale of the adjacent absolute-change statistic in the tested 1–30k ranges, and a finite-sieve independent-residual baseline was consistent with the same statistic in the two documented held-out ranges 40,001–60,000. These findings are limited to the specified statistics, ranges, and null models. No new prime-number law has been established.

Experiment 19 is a separate hypothesis about whether a +1 first difference is followed by a negative first difference. Its observed effect was not unusual under its specified finite-sieve simulation (upper-tail Monte Carlo estimate approximately 0.2926). It should not be conflated with the adjacent absolute-change experiments.

## Next research implications

1. Keep the +1-transition hypothesis separate from the sum-of-absolute-changes statistic.
2. Run the proposed empirical block-count shuffle control to quantify the contribution of differencing and count-distribution shape.
3. Preserve and document the modulo-30/210 phase structure when designing conditional randomizations.
4. For every model-based result, report the model's expected total prime-like count as well as the statistic distribution.
5. Pre-register new ranges and account for the exploratory history and multiple comparisons.
6. Do not describe a simplified finite-sieve Bernoulli model as the full Granville or Banks–Ford–Tao model.
