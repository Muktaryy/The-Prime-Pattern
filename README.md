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


## Experiment 8: Does the order create unusually large changes?

Question: compared with random rearrangements that preserve the counts within each 100-number cluster, does the actual ordering have unusually large neighbouring changes?

### Predefined statistic

For each cluster, calculate the absolute difference between each pair of neighbouring block counts, then sum across all 100 clusters. There are 900 adjacent pairs in total (9 per cluster). Cluster boundaries are never joined.

### Verified result

- Observed total absolute change: **955**
- Mean over 200,000 within-cluster shuffles: **874.99594**
- Median shuffled value: **875**
- Central 95% of shuffled values: **839 to 911**
- Shuffles with a value at least as large as observed: **2 of 200,000**
- One-sided Monte Carlo estimate with +1 correction: **0.000015**

The actual ordering therefore has substantially larger adjacent changes than almost all of the within-cluster random rearrangements in this simulation.

### Interpretation and limitations

This is evidence that the order of the block counts is not behaving like a uniformly random permutation conditional on the observed count frequencies within each cluster, under this particular test. It is not proof of a new prime-number law. The shuffle model is only one possible null model; it does not represent every plausible random process for prime counts. Also, this is an exploratory project with several analyses already tried, so the result should be treated as a lead for further testing, not as a confirmatory discovery. A stronger follow-up would define a new statistic in advance and test it on a separate, previously unused range of integers.

### Reproduction

Run: python analysis/order_test.py

The script uses 200,000 independent within-cluster permutations and seed 20261126.


## Experiment 9: Independent range test (10,001–20,000)

This range was not used to select the Experiment 8 statistic. We applied the same pre-defined statistic and the same within-cluster shuffle method to the next 10,000 integers.

### Data

- Range: 10,001–20,000
- Prime numbers: **1,033**
- Groups of 10: **1,000**
- Clusters of 100: **100**
- Raw counts: [data/prime_counts_10001_20000_by_10.csv](data/prime_counts_10001_20000_by_10.csv)

### Statistic and shuffle test

For each 100-number cluster, sum the absolute differences between its 9 adjacent pairs of block counts. Sum over all 100 clusters (900 adjacent pairs total). Shuffle the 10 block counts independently within each cluster, preserving the cluster's frequency of 0, 1, 2, 3 and 4.

- Observed total absolute change: **906**
- Mean of 100,000 shuffled totals: **842.19166**
- Median shuffled total: **842**
- Central 95% shuffled interval: **807 to 877**
- Shuffles at least as large as observed: **15 / 100,000**
- One-sided Monte Carlo estimate with +1 correction: **0.000160**

### Interpretation

The new, non-overlapping range shows the same direction as Experiment 8: the actual ordering has a larger total adjacent absolute change than nearly all within-cluster shuffled arrangements. This is a useful replication under the same conditional shuffle model.

It is not proof of a new prime-number law. The shuffle model tests one specific null hypothesis (uniform random ordering within each 100-number cluster while holding that cluster's counts fixed). The statistic and method were selected after earlier exploratory work, so the two experiments should not be treated as fully independent confirmatory evidence. A future confirmatory test should be specified before examining a further unused range, and should consider alternative null models.

### Reproduction

Run: python analysis/independent_range_test.py

The script uses 100,000 within-cluster permutations and NumPy seed 20261127.
