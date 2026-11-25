# Experiment 20 — Independent Design Review

Date: 2026-11-26

## Verdict

Gemini's central recommendation is sound: an unrestricted permutation of the 1,000 observed block counts destroys the deterministic modulo-30 phase structure of aligned blocks of ten. It should be retained only as a diagnostic control, not used as the main inferential comparison.

A phase-stratified permutation is a useful conditional test of whether the observed order contains information beyond the phase-specific count distributions. A within-window, phase-stratified permutation is a stricter sensitivity analysis.

## Verified phase structure

The blocks begin at 60,001 and are globally aligned as 60,001–60,010, 60,011–60,020, and so on. Their starting residues modulo 30 cycle through 1, 11, and 21.

For primes greater than 5, candidate positions coprime to 30 within these three block types are respectively:

- Phase 1: offsets 1 and 7 (two candidate slots).
- Phase 2: offsets 1, 3, 7, and 9 (four candidate slots).
- Phase 3: offsets 3 and 9 (two candidate slots).

The 1–2–3 phase sequence therefore has the 2–4–2 candidate-capacity pattern. In 1,000 blocks, the phase groups contain 334, 333, and 333 positions respectively.

The capacity pattern is deterministic. The actual prime counts are not fixed by it; other prime divisors and the changing prime density still matter.

## Recommended controls

### 20A — Unrestricted global permutation (diagnostic only)

Shuffle all 1,000 observed counts without phase restrictions. This destroys the modulo-30 phase/count association. Report the resulting distribution to illustrate how much the phase structure matters, but do not treat it as the primary fair null for prime ordering.

### 20B — Global modulo-30 phase-stratified permutation (primary)

Shuffle counts only among block positions with the same starting residue modulo 30. This preserves the exact observed count multiset within each of the three phase classes while removing ordering within each class.

This tests a conditional null: given the observed phase-specific count distributions, is the observed sequential arrangement unusual?

It does not preserve local density or local count distributions within 500-number windows.

### 20C — Within-window modulo-30 phase-stratified permutation (sensitivity)

Within each 500-number window, shuffle counts only among positions of the same modulo-30 phase. This preserves the count multiset separately for each phase in each window, controlling more tightly for local density and local distribution.

Each window contains 50 blocks, with 16 or 17 positions in each phase. The phase composition shifts between windows because 50 is not divisible by 3.

## Statistics and boundaries

Primary statistic: the original Experiment 19 conditional-probability difference Δ, computed using only transition pairs wholly inside each 50-block window (20 × 48 = 960 pairs).

Secondary statistic: compute Δ on the full 1,000-block sequence, including all 998 transition pairs. The 38 additional pairs cross the 19 window boundaries. Report this separately; do not silently combine it with the primary result.

For both statistics, compute the same observed value and the permutation distribution under each control.

## Tail definitions

Use a two-sided permutation p-value as the primary result for Experiment 20 because this is now a general test for departure in either direction from the conditional ordering null. Also report the upper-tail p-value for continuity with the original directional hypothesis.

For a discrete permutation distribution, define:
- upper tail: (number of simulated statistics >= observed + 1)/(B + 1);
- lower tail: (number <= observed + 1)/(B + 1);
- two-sided equal-tail value: min(1, 2 × min(lower-tail, upper-tail)).

Use B = 100,000 permutations and a documented fixed seed for each control. Report Monte Carlo uncertainty or a binomial interval for tail estimates. Do not treat 20A, 20B, and 20C as three independent confirmatory discoveries: 20B is primary, 20C is sensitivity, and 20A is diagnostic.

## Important interpretation limits

1. These are conditional permutation tests, not complete probabilistic models of prime numbers.
2. 20B preserves modulo-30 phase-specific histograms, but not modulo-210 or higher-prime phase structure.
3. 20C additionally preserves local phase-specific histograms within each 500-number window, but still does not preserve every arithmetic dependency.
4. A significant result would indicate ordering information beyond the constraints preserved by that particular permutation scheme. It would not establish a new prime law or identify the cause.
5. A non-significant result would mean no detectable departure under that conditional null and statistic; it would not prove independence.
6. The statistic Δ is a conditional-probability contrast built from overlapping first differences. It should be interpreted as a descriptive sequence statistic, not as 960 independent Bernoulli observations.
7. Experiment 20 uses a range whose observed sequence has already been examined in Experiment 19. The permutation scheme is being designed after seeing that result. Treat this as an exploratory conditional analysis, not a fresh blind confirmation. A stronger confirmatory replication should apply the locked design to a new untouched range.

## Suggested reporting language

If the primary 20B result is not significant:

“Conditional on the observed phase-specific block-count distributions modulo 30, the observed ordering in 60,001–70,000 did not show a statistically detectable departure from random ordering under the specified Δ statistic.”

If it is significant:

“Conditional on the observed phase-specific block-count distributions modulo 30, the observed ordering in 60,001–70,000 showed a departure from random ordering under the specified Δ statistic. The result does not identify the cause; higher-prime residue structure, local density, and other dependencies remain possible explanations.”

## Next step after Experiment 20

If a residual remains under 20B, examine a modulo-210-stratified conditional permutation and compare it with 20C. Then lock the complete design and test a genuinely untouched range, such as 70,001–80,000, without changing the statistic or model after seeing the result.
