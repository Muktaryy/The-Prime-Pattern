# Experiment 19 — Original +1 transition hypothesis (pre-registration)

**Status: registered before generating or examining the 60,001–70,000 prime data.**

## Research question
Within aligned 10-integer blocks, is a block-count increase of exactly one more often followed by a negative block-count change than are other block-count changes?

## Exact hypothesis
Let (C_i) be the number of primes in aligned block (i), and let (D_i=C_{i+1}-C_i).

Primary alternative: among eligible consecutive transition pairs, the probability that (D_{i+1}<0) is greater when (D_i=+1) than when (D_i\ne+1).

The comparison is an association in this particular block-count sequence. It is not a claim that one block causes the next change.

## Primary statistic
Within each fixed 500-integer window, form the 50 aligned block counts and the 49 first differences. Use only adjacent pairs ((D_i,D_{i+1})) fully inside the same window; never join across a window boundary.

Let:
- (a) = number of eligible pairs with (D_i=+1);
- (x) = number of those pairs with (D_{i+1}<0);
- (b) = number of eligible pairs with (D_i\ne+1);
- (y) = number of those pairs with (D_{i+1}<0).

The primary effect statistic is
[
\Delta = x/a - y/b.
]
A positive value means the next difference is negative more often after a +1 difference than after other differences. If either denominator is zero, the statistic is undefined and the experiment will be reported as inconclusive rather than changing the definition.

## Data range and boundaries
- Untouched holdout range: **60,001–70,000**, inclusive.
- Use global blocks aligned from 1: 60,001–60,010, ..., 69,991–70,000.
- Split into twenty consecutive windows of 500 integers (50 blocks each).
- Calculate transition pairs only within each 500-integer window.
- No partial edge blocks and no cross-window pairs.

## Null model
Use the project's fixed finite-sieve independent-residual baseline from Experiments 17–18:
1. Exclude every integer divisible by any prime at most 31: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31.
2. For each remaining integer (n), independently select it with probability (C/\ln(n)), where (C=\prod_{p\le31}p/(p-1)).
3. Selected integers form the simulated prime-like set; all excluded integers are unselected.

This is a deliberately simplified model, not the full Granville or Banks–Ford–Tao model and not a theorem about primes. It preserves divisibility restrictions from primes up to 31 and the approximate density decline, but assumes independence among survivors.

## Simulation and tail
- Simulations: **100,000**.
- Generator: Mulberry32, implemented in the saved JavaScript script.
- Seed: **20261216**.
- Primary tail: upper tail for \(\Delta\), because the stated alternative predicts a larger value.
- Monte Carlo p-value: ((r+1)/(100000+1)), where (r) is the number of simulated \(\Delta\) values at least as large as observed.
- Report the observed denominators (a,b), rates (x/a,y/b), \(\Delta\), model mean and central 95% interval, exceedance count, and plus-one p-value.

## Decision and interpretation rules
- A positive observed \(\Delta\) alone is descriptive, not sufficient evidence.
- A small model-based p-value means the observed statistic is unusual under this specified model only; it does not prove a new prime law.
- A non-small p-value means this holdout does not distinguish the observed transition effect from this model.
- If the statistic is undefined, report inconclusive. Do not alter the statistic, tail, range, windows, model, or seed after seeing the data.
- No secondary tests will be promoted to primary in this experiment.

## Reproducibility
The data-generation and analysis script, raw prime list, block-count table, machine-readable result, and final report will be saved in the repository. The script will validate the range, block count, prime total, and the sieve-generated prime list. A second implementation or independent rerun should be used before making any strong claim.
