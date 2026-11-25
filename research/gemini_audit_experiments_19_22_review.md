# Independent review of Gemini's audit: Experiments 19–22

Date: 2026-11-26

## Overall verdict

Gemini's main recommendation is reasonable: retire the specific transition hypothesis
\[
\Delta=P(D_{i+1}<0\mid D_i=+1)-P(D_{i+1}<0\mid D_i\ne+1)
\]
as the project's primary research direction. Experiment 19 did not find an unusual positive effect under its finite-sieve simulation (upper-tail p = 0.2926), and the untouched Experiment 22 holdout did not reproduce a positive excess under the global modulo-210 conditional permutation (observed Δ = 0.16365; null mean = 0.21442; upper-tail p = 0.93667; two-sided equal-tail p = 0.12670).

This is evidence against a large, stable positive effect under the tested designs. It is not proof that all prime-count dependence is absent.

## Verified repository facts

- Experiment 19's protocol registered an upper-tail test before examining 60,001–70,000.
- Experiment 20's design review explicitly changed the primary inferential framing to a two-sided equal-tail test for general departure, while retaining the upper-tail p-value for continuity. This design review predates the 70,001–80,000 holdout.
- Experiment 22's report says the statistic, windows, modulo-210 phase definition, two permutation controls, and plus-one p-value procedure were carried forward without tuning to the holdout.
- The Experiment 22 script validates all 1,000 block counts and the total of 902 primes against an independent sieve.
- Experiment 22 raw primary counts are a=214, x=101, b=746, y=230. Thus x/a = 0.4719626, y/b = 0.3083110, and Δ = 0.1636516.
- 22A's 100,000 simulations give mean 0.2144183, central 95% interval [0.1492063, 0.2785969], lower-tail plus-one p = 0.0633494, upper-tail plus-one p = 0.9366706, and equal-tail two-sided p = 0.1266987.
- 22B's within-window phase strata have sizes 2 or 3. Its corresponding mean is 0.1857449 and equal-tail p = 0.4328757.
- The code uses Fisher–Yates shuffling within each defined group. It counts ties in both tails (<= and >=), applies the plus-one correction to each tail, then doubles the smaller tail and caps at 1.
- The 960-pair statistic excludes 38 pairs crossing the 19 boundaries between 20 windows. The full-sequence statistic is separately reported over all 998 possible pairs.

## What Gemini gets right

1. **22A is the primary holdout result.** It preserves the observed count multiset within each of the 21 starting-residue classes modulo 210 and tests whether the temporal ordering is unusual under that conditional null.
2. **The holdout does not support the predicted positive excess.** The observed Δ is below the 22A null mean. The one-sided upper-tail p-value is about 0.937.
3. **22B is highly restrictive.** With only 2–3 positions in each within-window phase stratum, permutations are limited and many positions remain unchanged. It should remain a sensitivity analysis, not the primary control.
4. **Overlap is handled consistently within the Monte Carlo test.** The same overlapping-pair statistic is recomputed for every permuted sequence. A naive independent two-proportion test would not be justified.
5. **The result is not proof of independence.** These are conditional permutation tests, not complete models of prime generation.

## Corrections and qualifications to Gemini

### 1. The baseline around 0.21 is not universal

First differences of IID equal-variance counts have lag-one correlation -1/2, because adjacent differences share one count with opposite signs. This establishes dependence between differences under that model, but it does not by itself establish the value or even a universal sign/magnitude for the thresholded conditional contrast Δ.

Gemini's explanation that D_i=+1 necessarily pushes C_{i+1} above the block mean is not generally true. D_i=+1 only says C_{i+1}=C_i+1; the pair can occur below, around, or above the marginal mean. The value of Δ depends on the marginal count distribution and the conditioning structure. Describe 0.2144 as the simulated baseline under this particular 22A conditional null, not as a universal differencing constant.

### 2. 22B is over-conditioned, not mathematically invalid

A conditional permutation test is exact only under exchangeability within its strata. 22B tests a much narrower null that conditions on local phase-specific histograms in every 500-number window. Its small strata make the test low-information and close to the observed arrangement. This is a reason not to use it as the primary control, but not a proof that the test is mathematically invalid. “Data leakage” is not the most accurate description; “near-degenerate / heavily constrained permutations” is clearer.

### 3. 22A also has assumptions

22A requires exchangeability of counts among positions with the same modulo-210 starting phase under its null. It preserves phase-specific global histograms but does not preserve local density trends or higher-prime residue structure. The approximate 1/ln(x) drift over 70,001–80,000 is small, but the null is still conditional and approximate as a model for prime counts. It should not be called an exact test of all prime randomness without stating the exchangeability null.

### 4. Tail change is documented before the holdout

The original E19 upper-tail alternative was registered for 60,001–70,000. The E20 design review explicitly specified a two-sided equal-tail primary test for the later conditional permutation analysis, with the upper tail also reported. E22 carried this forward to the untouched range. Therefore Gemini's claim that the two-sided choice was made after seeing E22 is not supported by the repository record. The project should describe this as a documented design amendment after exploratory E19, not imply that E19 and E22 used an unchanged tail rule.

### 5. The power claims are unsupported

A central 95% interval width of roughly 0.13 does not alone establish that effects of 0.06 or more are ruled out. Nor does it quantify power for 0.1%–1% effects. A dedicated power simulation under specified alternatives is needed before making effect-size exclusion claims.

### 6. The 38 omitted boundary pairs are a protocol choice

The 960-pair primary statistic was specified in the E19 protocol and carried forward. The full 998-pair statistic is also reported as a secondary analysis. The boundary omission is not a computational error, although future designs could avoid arbitrary windows if there is a clear alternative null model.

## Recommended project decision

- Mark the narrow “D_i=+1 followed by D_{i+1}<0” hypothesis as **not supported by the current experiments; retire as a primary hypothesis**.
- Keep E19–E22 and their negative / inconclusive findings in the repository. Do not delete the work.
- Treat 22A as the primary E22 holdout result. Keep 22B labelled as a highly constrained sensitivity analysis.
- Do not claim a universal 0.21 baseline, independence, a proof of no prime pattern, or a quantified minimum detectable effect.
- If the project continues, pivot to a better-motivated statistic such as residual block-count autocovariance or short-interval variance, with a pre-specified density adjustment, larger independent ranges, and explicit power analysis. Compare against appropriate sieve / Hardy–Littlewood benchmarks before interpreting any residual.

## Suggested concise conclusion

“Across the pre-registered finite-sieve test in 60,001–70,000 and the untouched modulo-210 conditional-permutation holdout in 70,001–80,000, we found no statistically significant evidence for the proposed positive +1 transition effect. In the holdout, the observed effect was below the global modulo-210 null mean. The within-window modulo-210 control was highly constrained by strata of only 2–3 blocks and is retained only as a sensitivity analysis. These results do not prove independence or rule out other forms of prime-count dependence.”
