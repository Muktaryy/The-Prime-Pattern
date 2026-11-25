# The Prime Pattern Project

A collaborative exploratory project investigating prime counts in consecutive blocks of 10 integers, their differences, and whether observed transitions depart from a shuffled-order baseline.

## Research question

When a block of 10 contains one more prime than the previous block (a first difference of +1), is the next first difference more likely to be negative?

We use aligned blocks: 1–10, 11–20, 21–30, and so on. Ten consecutive blocks form one cluster of 100 integers. Differences and consecutive-difference transitions are calculated **within each 100-number cluster only**; we do not join the end of one cluster to the beginning of the next.

## Verified dataset: 1–10,000

- Integers examined: 10,000
- Prime numbers: 1,229 (the known value of pi(10,000))
- Blocks of 10: 1,000
- Clusters of 100: 100
- Data file: [data/prime_counts_by_10.csv](data/prime_counts_by_10.csv)

The CSV contains the prime count for every aligned block of 10.

## Experiment: +1 followed by a negative difference

For each cluster, let C_i be the prime count in block i and D_i = C_(i+1) - C_i. We examine adjacent pairs (D_i, D_(i+1)) within each cluster.

Observed result across 1–10,000:

- Starting difference +1: next difference negative in 96 of 178 cases = 53.93%.
- All other starting differences: next difference negative in 195 of 622 cases = 31.35%.

These are descriptive statistics, not proof of a mathematical law or a reliable prediction rule.

## Shuffle test

To check whether the ordering of block counts matters, we independently shuffled the 10 block counts inside each 100-number cluster, recalculated the statistic, and repeated this 20,000 times.

- Observed proportion: 53.93%.
- Mean shuffled proportion: 50.25%.
- Central 95% of shuffled proportions: approximately 43.92%–56.59%.
- Shuffled trials at least as high as the observed value: 2,562 / 20,000 = 12.81%.

Interpretation: the observed value is somewhat above the shuffled mean, but it is not especially unusual under this shuffle baseline. This experiment does **not** provide strong evidence that the ordering creates a meaningful special relationship. Further tests should be preregistered and should account for multiple comparisons.

Shuffle details: 20,000 independent within-cluster permutations; random generator seed 20261125; statistic = number of pairs with D_i=+1 and D_(i+1)<0 divided by the number of pairs with D_i=+1.

## Important research standards

1. Keep raw data separate from interpretations.
2. Verify all counts computationally before drawing conclusions.
3. State the exact grouping and boundary rules for every experiment.
4. Distinguish an observed pattern from a proven theorem.
5. Compare against an appropriate null model before claiming a pattern is unusual.
6. Record code, random seeds, and sample sizes so results can be reproduced.

## Earlier conversation notes

The initial project began with manually counting primes in groups of 10 and clusters of 100. Some earlier transition tables and interval summaries in chat were not reliably calculated. They should be treated as provisional and superseded by the verified 1–10,000 dataset and shuffle test documented here.

## Next steps

- Publish the analysis script used to reproduce the counts and shuffle test.
- Repeat with a larger range using the same fixed protocol.
- Compare alternative null models, including shuffling within clusters and simulations that preserve local count distributions.
- Avoid searching many patterns and reporting only the strongest one; define tests before examining new data.
