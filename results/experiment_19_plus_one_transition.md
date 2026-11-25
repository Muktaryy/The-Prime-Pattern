# Experiment 19 — Original +1 transition hypothesis

## Pre-registration
The protocol was saved before the holdout range was generated or examined: [experiment_19_protocol.md](../research/experiment_19_protocol.md).

## Data
- Range: **60,001–70,000**, inclusive
- Aligned blocks of 10: **1,000**
- Windows: **20 × 500 integers**
- Prime count: **878**
- Prime-list generation: Sieve of Eratosthenes

## Primary statistic
For block counts C_i, define D_i=C_(i+1)-C_i. Within each 500-integer window, compare the frequency of D_(i+1)<0 after D_i=+1 with the frequency after D_i≠+1. The primary statistic is Δ = P_hat(next difference negative | current difference +1) − P_hat(next difference negative | current difference not +1). There are 960 eligible adjacent-difference pairs across the 20 windows.

- Pairs after +1: a=227; followed by a negative difference: x=116; rate=0.511013.
- Other starting differences: b=733; followed by a negative difference: y=199; rate=0.271487.
- Observed Δ = **0.239526**.

## Null-model simulation
The pre-registered finite-sieve model excludes multiples of primes through 31 and independently selects each remaining n with probability C/ln(n), where C=6.5422697091. It used 100,000 simulations, Mulberry32 seed 20261216, upper-tail test.

- Simulated Δ mean: 0.220993
- Median: 0.221073
- Central 95% interval: 0.154213 to 0.286409
- Simulations with Δ at least observed: 29262 / 100000
- Upper-tail Monte Carlo p-value (+1 correction): **0.292627**
- Undefined simulations: 0

## Interpretation
The observed Δ is not in the upper 5% tail of this specified finite-sieve model. This holdout does not provide evidence that the +1 transition association is unusually strong relative to this baseline.

The statistic describes an association, not causation. This is one holdout range and one simplified null model. It does not settle the hypothesis universally. No alternative statistic or tail direction was substituted after seeing the result.

## Reproduction
From the repository root run: `node analysis/experiment_19_plus_one_transition.js`.
