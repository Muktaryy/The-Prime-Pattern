# Literature review: prime-count fluctuations and local patterns

Prepared for The Prime Pattern Project. This is a working research map, not a claim of exhaustive coverage.

## Our question

The project records the number of primes in aligned blocks of ten integers and studies changes between adjacent block counts. The main statistics explored so far include (i) whether a +1 change is followed by a negative change and (ii) the sum of absolute adjacent changes within fixed windows.

The broad subject is established: local distribution of primes, short-interval counts, correlations, sieve models, and random models of primes. The exact block statistic should be checked against the literature before any novelty claim.

## Key research lines and what they teach us

### 1. Prime number theorem and density

The prime number theorem says that the number of primes up to x is asymptotic to x/log(x). Equivalently, a first approximation to the chance that a large integer near x is prime is 1/log(x). This explains the smooth decline in prime density, but does not by itself describe short-range dependence or local fluctuations.

### 2. Cramér's random model (1936)

Cramér models each integer n as independently prime with probability about 1/log(n). It is a useful baseline for some questions, especially prime gaps, but its independence assumption misses local divisibility constraints and gives incorrect predictions for prime tuples. See Banks, Ford and Tao (2023), section 1.1:
https://link.springer.com/article/10.1007/s00222-023-01199-0

### 3. Granville's refinement (1995)

Granville modified the random model by first removing integers divisible by small primes, then randomly selecting among survivors with a density-adjusted probability. This is conceptually close to the project's move from unrestricted shuffling to preserving modulo-30 and modulo-210 restrictions. The project's fixed modulus 210 is a finite small-prime sieve, not the full Granville model, whose sieve level grows with x.

### 4. Hardy–Littlewood prime tuples and the singular series

Hardy and Littlewood predict frequencies of fixed prime patterns using a product of local factors over primes. The key lesson is that the probability of a prime pattern is not obtained by treating candidate positions as independent without correction: each modulus can forbid certain residue patterns. The singular series accounts for these local obstructions. Twin primes are a famous unproved special case.

Accessible exposition:
https://kskedlaya.org/ant/chap-k-tuples.html
Research discussion:
https://londmathsoc.onlinelibrary.wiley.com/doi/full/10.1112/jlms.12663

### 5. Maier's theorem (1985)

Maier proved that primes in sufficiently short intervals exhibit irregularities beyond the prediction of the simplest Cramér model. Thus local fluctuations can be mathematically meaningful, but the scale and model matter. It does not imply that every observed fluctuation is a new phenomenon.

### 6. Consecutive-prime residue biases: Lemke Oliver and Soundararajan (2016)

They studied ordered patterns of consecutive primes modulo q. The frequencies are biased at finite scales, and they proposed an explanation based on Hardy–Littlewood conjectures and slowly decaying secondary terms. This is close in spirit to studying transitions, but their objects are residues of consecutive primes, not counts in consecutive integer blocks.

Paper:
https://pmc.ncbi.nlm.nih.gov/articles/PMC4978288/

### 7. Modern probabilistic sieve models: Banks, Ford and Tao (2023)

They introduced a model based on selecting random residue classes for each small prime modulus and retaining integers that survive the resulting sieve. This is more structurally faithful to prime divisibility than independent Bernoulli selection. It is an important direction for improving our project's baseline.

Paper:
https://link.springer.com/article/10.1007/s00222-023-01199-0

### 8. Variance in short intervals and links to RH / pair correlation

The variance of prime counts in short intervals is connected to the Riemann Hypothesis, Montgomery's pair-correlation conjecture, and Hardy–Littlewood. This is a more advanced mathematical framework for measuring fluctuations. A 2024 paper by Ofir Gorodetsky studies the related variance for integers with no small prime factors and discusses these connections.

Paper:
https://link.springer.com/article/10.1007/s00209-024-03601-w

## Comparison with our current experiments

- Experiments 8–11 used conditional shuffles of observed block counts. These test exchangeability under a chosen partition, not a universal model of primes.
- Experiment 12 improved the null by preserving modulo-30 phase.
- Experiment 13 reports modulo-210 results but must be independently rerun from its saved script before those numerical results are relied on.
- Experiment 14 preserves modulo-210 phase inside 500-integer windows.
- Experiment 15 uses independent Bernoulli selections among numbers coprime to 210, with probability 210/(48 log n). This captures a smooth density trend and the first four prime divisors, but is still a simplified model. It does not implement the full Hardy–Littlewood singular series or a growing sieve.
- Experiment 16 is a held-out test on 30,001–40,000, with the Experiment 15 model and statistic fixed before examining this range.

## Research plan to become technically serious

1. Reproduce every published experiment from code and raw data; correct any discrepancy.
2. Keep the original +1-followed-by-negative hypothesis separate from the absolute-change hypothesis.
3. Pre-register one statistic, window size, boundary rule, null model, seed, and tail direction before each new range.
4. Compare at least three baselines:
   - independent density model with small-prime sieve;
   - phase-preserving conditional shuffle;
   - a more faithful sieve / Hardy–Littlewood local-factor model.
5. Study the mean, variance, autocorrelation, and full distribution of block counts—not only one selected statistic.
6. Correct for multiple testing if many statistics, window sizes, moduli, or ranges are explored.
7. Test on genuinely untouched ranges and report all results, including null results.
8. Only after a robust anomaly remains should we formulate a mathematical conjecture and seek a proof.

## Experiment 16: held-out test result

Range: 30,001–40,000. There are 958 primes. The fixed Experiment 15 model expects 955.81894. The observed within-window adjacent absolute-change statistic is 939 (20 windows of 500 integers, 980 adjacent pairs). In 100,000 simulations, the mean statistic is 919.48705, median 919, central 95% interval 862–978, and 25,978 simulations were at least as large as observed. The plus-one upper-tail estimate is 0.2597874. The simulated total-prime-count mean is 956.01641, with central 95% interval 911–1002; the actual count 958 lies inside it.

Interpretation: this held-out range is consistent with the fixed simplified model. It does not support an unusually large adjacent-change effect. This is evidence about this statistic and this baseline only, not a proof that the model describes primes in general.

Reproduction: node analysis/heldout_smooth_density_test.js


## Recent overview and further reading (checked November 2026)

### Will Sawin, "Probabilistic Models in Number Theory" (ICM 2026)

A recent invited lecture gives a broad overview of probabilistic models in number theory. It emphasizes that the difficult part is choosing the right distribution: a model can accurately predict some properties and fail on others. It explicitly discusses Cramér, Granville, Maier, and random-matrix models for zeta zeros.

https://doi.org/10.1137/25M1806132

### Pandey and Woo, "Small-scale distribution of linear patterns of primes" (2024)

This paper proves analogues of Maier-type irregularity results for certain systems of linear prime patterns. It shows that local equidistribution can fail on small scales, even when a global asymptotic formula is known. It is not the same statistic as our ten-integer block-count variation, but it confirms that local-scale prime irregularities are an active and technically sophisticated research area.

https://doi.org/10.1112/jlms.13001

### Granville, "Harald Cramér and the distribution of prime numbers" (1995)

An influential expository account of how Cramér's model shaped later research and why sieve corrections matter.

https://doi.org/10.1080/03461238.1995.10413946

### Short-interval variance and pair correlation

The variance of prime counts in short intervals is connected to pair-correlation questions for zeta zeros. This is closer to a rigorous mathematical framework for fluctuation statistics than a single finite-range shuffle test.

https://doi.org/10.1112/jlms/jdw030

## What this means for our project

Our current Experiment 15/16 baseline is a finite-sieve independent model: it removes multiples of 2, 3, 5, and 7, then independently selects each surviving number with probability 210/(48 log n). This is a useful teaching and diagnostic baseline, but it is not the full Granville model, not the Banks–Ford–Tao random sieve model, and not the Hardy–Littlewood singular-series model. Those distinctions must remain explicit.

A possible original contribution would not be "discovering that primes fluctuate." That is established. A defensible contribution would require all of the following:
- a precisely defined statistic for the block-count sequence;
- a mathematical derivation of its expected behaviour under a recognized prime model;
- comparison with the actual primes over large, independently selected ranges;
- an effect that survives appropriate sieve/local-factor corrections and multiple-testing controls;
- an explanation or proof, not merely a small simulated p-value.

At present, no such residual effect has been established.
