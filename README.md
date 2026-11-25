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


## Experiment 10: Coarse-cluster shuffle test

### Why this alternative model?

The earlier experiments shuffled counts within 100-number clusters. That preserves very local prime-count frequencies. Here we use a broader null model: independently shuffle the 100 block-counts within each 1,000-number cluster. This preserves the total number of primes and the distribution of block counts in each 1,000-number region, while allowing the order within that wider region to change.

For each 1,000-number cluster, calculate the sum of absolute differences between adjacent block counts (99 adjacent pairs). Sum across the 10 clusters, for 990 adjacent pairs total. Compare the observed statistic with 100,000 shuffled arrangements.

### Results

| Range | Primes | Observed statistic | Shuffle mean | Central 95% interval | Shuffles >= observed |
|---|---:|---:|---:|---:|---:|
| 1–10,000 | 1,229 | **1,045** | 940.80511 | 901–980 | 0 / 100,000 |
| 10,001–20,000 | 1,033 | **1,001** | 907.48098 | 868–945 | 0 / 100,000 |

No simulated shuffle reached the observed statistic in either range. With the standard plus-one correction, the Monte Carlo estimate is 1/100,001 (about 0.000010) for each range. Since there were zero exceedances, this is a simulation-resolution estimate, not a precise measurement of the true tail probability; the data are consistent with a small tail probability, but more simulations would be needed to estimate it more precisely.

### Interpretation and limitations

The high adjacent variation remains when we preserve prime-count frequencies at the broader 1,000-number scale rather than the 100-number scale. This makes the finding less dependent on the original, narrower shuffle choice.

It still does not establish a new prime-number law. Both ranges were explored after the general pattern had already attracted our attention, and the statistic was developed from earlier exploratory work. The null model is also a particular randomization model, not a complete model of how primes behave. A stronger next step is to preregister the statistic, partition, and null model, then test on a genuinely untouched range.

Reproduction: `python analysis/coarse_cluster_shuffle_test.py` (100,000 permutations per range; seeds 20261128 and 20261129).


## Experiment 11: Pre-specified coarse-cluster test on a held-out range

Before examining this range, we fixed the method to match Experiment 10:

- Range: **20,001–30,000**, not used in the earlier experiments
- Divide into 1,000 consecutive blocks of 10 integers
- Divide those into ten clusters of 1,000 integers (100 block-counts per cluster)
- Statistic: within each cluster, sum the absolute differences between adjacent block-counts; then sum across all ten clusters (990 adjacent pairs)
- Null model: independently permute the 100 block-counts within each 1,000-number cluster, preserving each cluster's count distribution
- Simulations: **100,000**, NumPy seed **20261130**
- Tail: upper tail, because the pre-existing hypothesis predicts unusually large adjacent variation

### Data

- Prime numbers in 20,001–30,000: **983**
- Data: [data/prime_counts_20001_30000_by_10.csv](data/prime_counts_20001_30000_by_10.csv)

### Results

- Observed total absolute change: **946**
- Mean shuffled statistic: **859.05923**
- Median shuffled statistic: **859**
- Central 95% shuffled interval: **822 to 895**
- Shuffles at least as large as observed: **0 / 100,000**
- Plus-one Monte Carlo estimate: **0.000010**

Zero exceedances does not mean the true probability is zero. At this simulation size, the plus-one estimate is the smallest reportable value; more simulations would be needed to estimate a smaller tail probability precisely.

### Interpretation

The held-out range has the same direction as the earlier coarse-cluster experiments: its observed adjacent variation exceeds all 100,000 simulated rearrangements under this specific null model. This is a useful out-of-sample replication of the pre-specified statistic and randomization scheme.

It is not proof of a new prime-number law. The test only rejects (at the resolution of this simulation) the particular model that uniformly randomizes the 10-number block-counts within each fixed 1,000-number cluster. Other null models and mathematical explanations remain possible.

### Reproduction

Run: `python analysis/heldout_coarse_cluster_test.py`

The script uses 100,000 within-cluster permutations and seed 20261130.


## Experiment 12: Preserve the modulo-30 phase

### Why this null model?

Every prime greater than 5 must be coprime to 30. Therefore, 10-number blocks starting at residues 1, 11, and 21 modulo 30 have different candidate-position patterns. The earlier coarse shuffle tests mixed these phases together and did not preserve this known arithmetic structure.

### Corrected phase-preserving test

Within each 1,000-number cluster, counts are shuffled only among blocks whose starting integers have the same residue modulo 30. The phase groups are recalculated separately in every cluster because 1,000 is not divisible by 30. The statistic is the total absolute adjacent change within the ten clusters (990 adjacent pairs).

| Range | Observed | Shuffle mean | Central 95% interval | Shuffles >= observed | +1 estimate |
|---|---:|---:|---:|---:|---:|
| 1–10,000 | **1,045** | 1,003.87 | 973–1,035 | 474 / 100,000 | 0.00475 |
| 10,001–20,000 | **1,001** | 955.76 | 923–988 | 314 / 100,000 | 0.00315 |
| 20,001–30,000 | **946** | 897.11 | 866–928 | 93 / 100,000 | 0.00094 |

### Interpretation

Preserving modulo-30 phase explains part of the effect seen under the earlier coarse shuffles. The observed statistic remains above the 95% interval in all three ranges under this particular null model, but that is not proof of a new prime-number law. The test still assumes that block counts are exchangeable among same-phase positions within each 1,000-number cluster.

### Reproduction

Run: `python analysis/phase_preserving_shuffle_test.py`

The corrected script uses 100,000 simulations per range and seeds 20261201–20261203. It recalculates the phase positions in each cluster.

## Experiment 13: Preserve the modulo-210 phase

### Why test modulo 210?

Every prime greater than 7 must be coprime to 210, because 210 = 2 × 3 × 5 × 7. A 10-number block's possible prime positions therefore depend on its starting residue modulo 210. Since 1,000 is not divisible by 210, the phase pattern shifts from one 1,000-number cluster to the next.

### Method

We keep the same statistic: sum the absolute differences between adjacent 10-number block counts, separately within each of ten 1,000-number clusters (990 adjacent pairs total).

For each cluster, we shuffle counts only among blocks with the same starting residue modulo 210. This preserves the position pattern imposed by divisibility by 2, 3, 5, and 7, while also preserving the observed count distribution within each phase group and cluster.

We ran 100,000 simulations for each range, using fixed seeds 20261204–20261206.

### Results

| Range | Primes | Observed | Shuffle mean | Central 95% interval | Shuffles >= observed | +1 estimate |
|---|---:|---:|---:|---:|---:|---:|
| 1–10,000 | 1,229 | **1,045** | 1,015.44 | 988–1,042 | 1,734 / 100,000 | 0.01735 |
| 10,001–20,000 | 1,033 | **1,001** | 969.77 | 940–1,000 | 2,138 / 100,000 | 0.02139 |
| 20,001–30,000 | 983 | **946** | 902.83 | 876–930 | 87 / 100,000 | 0.00088 |

### Interpretation

Preserving modulo 210 raises the shuffle means and makes the first two ranges much less unusual than they appeared under the modulo-30 model. In the first two ranges, about 1.7% and 2.1% of the simulated arrangements reached or exceeded the observed statistic. The third range remains more unusual under this particular test.

This is evidence that divisibility constraints involving 7, in addition to 2, 3, and 5, explain more of the earlier variation. It does not show that the remaining variation is a new prime pattern. The model still assumes exchangeability among same-phase blocks within each 1,000-number cluster; gradual changes in prime density and other arithmetic dependencies are not fully modelled. Also, these ranges have already been explored, so the results are exploratory rather than a fresh confirmatory test.

### Reproduction

Run: `python analysis/modulo210_shuffle_test.py`

The script uses 100,000 simulations per range, vectorized in batches, with fixed seeds 20261204–20261206.


## Experiment 14: Smaller local windows with modulo-210 phase preserved

### Question

Does the remaining excess variation become less unusual when we preserve prime-count behaviour in smaller parts of the number line, rather than in 1,000-number clusters?

### Method

We divide each 10,000-number range into twenty consecutive windows of 500 integers (50 blocks of 10 per window). Within each window, block counts are shuffled only among positions whose starting integers have the same residue modulo 210. This preserves the candidate-position pattern from divisibility by 2, 3, 5, and 7, and preserves the observed count distribution within each 500-number window and phase.

The statistic is the sum of absolute differences between adjacent block counts, calculated separately within each 500-number window. There are 20 × 49 = 980 adjacent pairs. No difference is counted across a 500-number window boundary.

We ran 100,000 simulations per range. The reproducible JavaScript script uses the Mulberry32 pseudorandom generator with fixed seeds 20261207–20261209.

### Results

| Range | Primes | Observed statistic | Shuffle mean | Central 95% interval | Shuffles >= observed | +1 estimate |
|---|---:|---:|---:|---:|---:|---:|
| 1–10,000 | 1,229 | **1,033** | 1,004.34 | 980–1,029 | 1,151 / 100,000 | 0.01152 |
| 10,001–20,000 | 1,033 | **991** | 965.39 | 939–992 | 2,990 / 100,000 | 0.02991 |
| 20,001–30,000 | 983 | **937** | 899.36 | 877–922 | 55 / 100,000 | 0.00056 |

### Interpretation

The first two ranges are now much less unusual: about 1.15% and 2.99% of the shuffled arrangements reached or exceeded the observed statistic. In the second range, the observed value is inside the central 95% interval. The third range remains more unusual under this particular null model.

This supports the idea that preserving more local structure helps explain some of the earlier excess variation. It does not establish a new prime-number law. The third range may reflect further local density changes, remaining arithmetic dependencies, or chance. These tests are exploratory, and the ranges have already been examined.

### Reproduction

Run: `node analysis/fine_window_modulo210_test.js`

The script uses 100,000 simulations per range and seeds 20261207, 20261208, and 20261209.


## Experiment 15: Smooth prime-density simulation

### Question

Can the remaining excess adjacent variation be explained by the ordinary decline in prime density as numbers get larger, once the modulo-210 candidate restriction is included?

### Null model

For every integer n greater than 7:
- If gcd(n, 210) > 1, it is excluded as a candidate.
- If gcd(n, 210) = 1, it is independently declared prime with probability 210 / (48 ln(n)).
- The four primes 2, 3, 5, and 7 are included as fixed primes.

Here 48 is Euler's totient phi(210), the number of residue classes coprime to 210. The factor 210/48 adjusts the usual 1/ln(n) prime-density approximation to apply only to numbers coprime to 210.

For each simulated range, we count primes in aligned blocks of 10 and calculate the sum of absolute differences between adjacent block counts within twenty separate 500-number windows (980 adjacent pairs). We compare this with 100,000 simulations.

This is a deliberately simple probabilistic model: it includes the smooth density decline and the modulo-210 candidate restriction, but treats eligible integers as independent. Actual primes have additional arithmetic dependencies, so this is a baseline rather than a complete model of primes.

### Results

| Range | Actual prime count | Model expected count | Observed statistic | Simulated statistic mean | Central 95% interval | Simulations >= observed |
|---|---:|---:|---:|---:|---:|---:|
| 1–10,000 | 1,229 | 1,245.94 | **1,033** | 1,014.79 | 954–1,075 | 28,366 / 100,000 |
| 10,001–20,000 | 1,033 | 1,043.07 | **991** | 954.39 | 895–1,014 | 11,719 / 100,000 |
| 20,001–30,000 | 983 | 987.97 | **937** | 932.16 | 874–991 | 44,035 / 100,000 |

Upper-tail plus-one Monte Carlo estimates are approximately 0.28367, 0.11720, and 0.44036, respectively.

### Interpretation

All three observed statistics fall inside the central 95% intervals from this smooth-density simulation. Under this baseline, none of the three ranges has unusually large adjacent variation. In particular, the 20,001–30,000 range that stood out under the earlier conditional shuffle tests is not unusual under this model.

This suggests that the remaining variation can be consistent with a simple model combining the modulo-210 restriction and the gradual decline in prime density. It does not prove that this model fully explains prime distribution: the simulation assumes independence among candidate integers, which is not true of actual primes. The model also uses an approximation to prime probability, not an exact theorem.

### Reproduction

Run: `node analysis/smooth_density_simulation.js`

The script uses 100,000 simulations per range and fixed seeds 20261210–20261212.


## Experiment 16: held-out smooth-density test (30,001–40,000)

This range was held out from the earlier exploratory analyses. Before computing its result, we kept the Experiment 15 model, block size, window size, statistic, and upper-tail direction fixed.

### Method

- Range: 30,001–40,000; 1,000 aligned blocks of 10.
- Windows: twenty consecutive windows of 500 integers (50 blocks each).
- Statistic: sum of absolute differences between adjacent block counts within each 500-number window; 980 adjacent pairs, with no boundary joins.
- Null model: each n > 7 coprime to 210 is independently selected with probability 210/(48 ln n); numbers not coprime to 210 are excluded; 2, 3, 5, and 7 are fixed primes.
- Simulations: 100,000; Mulberry32 seed 20261213.

### Results

- Actual prime count: **958**
- Model expected prime count: **955.81894**
- Simulated total-count mean: **956.01641**
- Simulated total-count central 95% interval: **911–1,002**
- Observed adjacent-change statistic: **939**
- Simulated statistic mean: **919.48705**
- Median: **919**
- Central 95% interval: **862–978**
- Simulations at least as large as observed: **25,978 / 100,000**
- Upper-tail plus-one estimate: **0.2597874**

### Interpretation

The observed prime total and adjacent-change statistic both lie comfortably within the simulated ranges. Under the fixed Experiment 15 baseline, this held-out range does not show unusually large adjacent variation. This is a useful out-of-sample check, but it does not prove that the simplified model is a complete description of prime behaviour.

### Reproduction

Run: `node analysis/heldout_smooth_density_test.js`

The raw block counts are in [data/prime_counts_30001_40000_by_10.csv](data/prime_counts_30001_40000_by_10.csv).

## Experiment 17: finite-sieve model with primes up to 31 (held-out range)

### Question

Does adjacent variation in prime counts remain unusual after the model accounts for divisibility by more small primes than the modulo-210 baseline?

### Pre-specified model and test

We used the previously untested range **40,001-50,000**. The model and statistic were fixed before running the simulation.

1. Exclude every integer divisible by any prime up to 31: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, and 31.
2. For every remaining integer n, independently declare it prime with probability C / ln(n), where C is the product over primes p <= 31 of p/(p-1) = **6.5422697091**.
3. Count selected integers in aligned blocks of 10.
4. Divide the range into twenty consecutive windows of 500 integers. Within each window, calculate the sum of absolute differences between adjacent block counts. The total has **980 adjacent pairs**.
5. Run **100,000** simulations using Mulberry32 seed **20261214**. The primary test is the upper tail because the original question concerns unusually large adjacent variation.

This is a finite-sieve, independent-residual model inspired by the logic of Cramér/Granville-style models. It is not the full Granville model or the Banks-Ford-Tao random-sieve model: after the small-prime exclusions, the remaining selections are independent. The factor C adjusts the approximate prime density conditional on surviving the finite sieve.

### Results

| Quantity | Result |
|---|---:|
| Actual prime count | **930** |
| Model expected prime count | 935.68148 |
| Simulated total-count mean | 935.62902 |
| Simulated total-count central 95% interval | 898-973 |
| Observed adjacent-change statistic | **890** |
| Simulated statistic mean | 921.30984 |
| Simulated statistic median | 921 |
| Simulated statistic central 95% interval | 870-972 |
| Simulations with statistic >= observed | 88,939 / 100,000 |
| Upper-tail plus-one estimate | 0.8893911 |

The observed total and adjacent-change statistic are both within the model's central 95% ranges. The observed variation is actually below the simulated mean, so this test gives no evidence of unusually large adjacent variation in this range under the specified model.

### Interpretation and limitations

Adding exclusions for primes 11 through 31 gives the model more of the local arithmetic structure of primes. On this held-out range, the observed adjacent variation is not unusually high. This is evidence that a simple finite-sieve baseline can reproduce the scale of this statistic here; it is not proof that the model captures all prime correlations.

The model still treats surviving integers independently. It does not impose Hardy-Littlewood prime-tuple correlations or the dependence created by larger prime factors. The result is one test on one range, and it does not establish a new prime law.

### Reproduction

Run: node analysis/finite_sieve_heldout_test.js

The 1,000 observed block counts are in [data/prime_counts_40001_50000_by_10.csv](data/prime_counts_40001_50000_by_10.csv).

## Experiment 18: fixed finite-sieve model, second held-out range (50,001-60,000)

This is a direct repeat of Experiment 17, with only the range and seed changed. The model excludes multiples of primes up to 31, then independently selects each survivor n with probability C/ln(n), where C = product over primes p <= 31 of p/(p-1) = 6.5422697091. We use 1,000 aligned blocks of 10, twenty 500-integer windows, and the sum of absolute adjacent block-count differences within windows (980 pairs). The upper tail is the pre-specified primary direction. We ran 100,000 simulations with Mulberry32 seed 20261215. No model parameters or statistic definitions were changed after Experiment 17.

### Results

| Quantity | Result |
|---|---:|
| Actual prime count | **924** |
| Model expected prime count | 920.76362 |
| Simulated total-count mean | 920.71307 |
| Simulated total-count central 95% interval | 883-958 |
| Observed adjacent-change statistic | **892** |
| Simulated statistic mean | 913.29502 |
| Simulated statistic median | 913 |
| Simulated statistic central 95% interval | 862-965 |
| Simulations with statistic >= observed | 79,559 / 100,000 |
| Upper-tail plus-one estimate | 0.7955920 |

The observed prime total and adjacent-change statistic both lie inside the model's central 95% ranges. The observed adjacent variation is below the simulated mean. The upper-tail estimate is about 0.796, so this range gives no evidence of unusually large adjacent variation under the fixed model.

Together, Experiments 17 and 18 show that the same finite-sieve baseline is consistent with the scale of this statistic in two consecutive held-out ranges. This is a limited check, not proof that the model captures all prime correlations or that the original pattern question is settled. The model still treats surviving integers independently and does not impose Hardy-Littlewood prime-tuple correlations.

Reproduction: `node analysis/finite_sieve_heldout_test_50001_60000.js`

The 1,000 observed block counts are in [data/prime_counts_50001_60000_by_10.csv](data/prime_counts_50001_60000_by_10.csv).


## Complete prime data archive (1-60,000)

We now preserve the actual prime numbers as well as block counts. This archive was generated with a sieve of Eratosthenes and checked against the grouped totals.

- [Complete list of all 6,057 primes from 1 through 60,000](data/prime_numbers_1_60000.csv): one prime per row.
- [Prime membership and counts at three scales](data/prime_counts_and_members_by_scale_1_60000.csv): each row gives the block size, start, end, number of primes, and the exact prime numbers in that block.

The grouped file contains:
- **6,000** blocks of 10 integers;
- **600** blocks of 100 integers;
- **60** blocks of 1,000 integers.

For each scale, the block counts sum to **6,057**, matching the complete prime catalog. This lets us study exact prime positions, local gaps, and counts at multiple scales without reconstructing the prime list from count-only files.

Going forward, every new range should be archived in the same way: exact prime list plus block membership/counts at 10, 100, and 1,000.


## Permanent data and research protocol

The project's required data fields, experiment records, reproducibility standards, statistical safeguards, and recommended workflow are documented in [research/RESEARCH_PROTOCOL.md](research/RESEARCH_PROTOCOL.md). Follow this protocol for all new datasets and experiments.
