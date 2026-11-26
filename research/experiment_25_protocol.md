# Experiment 25 — larger pre-registered holdout for aligned block covariance

Date locked: 2026-11-26
Status: Protocol committed before generating or inspecting prime-count results for this interval.

## Question
Does the aligned finite conditioned random-sieve model remain compatible with prime-count residual covariances for block lengths b=10,30,210 and lags k=1,2,3 in a larger independent interval?

## Holdout interval and alignment
Use the half-open interval [300511,720511), length 420000=2000×210. The lower endpoint is 1 modulo 210, and (300511−1) is divisible by 10, 30 and 210. This gives:
- b=10: 42,000 blocks
- b=30: 14,000 blocks
- b=210: 2,000 blocks

This interval is disjoint from Experiments 23B and 24. It is a new holdout interval, but the model family and statistics are not new: they were developed using earlier intervals.

## Fixed model
Use the same finite aligned conditioned random-sieve model as Experiments 23B and 24, without retuning:
- sieve cutoff z=613;
- Theta_613=product over p≤613 of (1−1/p);
- for each b, integers not coprime to b are ineligible;
- for p≤613 dividing b, fix forbidden residue a_p=0;
- for p≤613 not dividing b, draw one uniform forbidden residue modulo p per replicate, shared over the whole interval;
- independently retain each eligible survivor n with probability q_n=1/(Theta_613 log n).

All q_n must be in (0,1]. No parameter may be changed after examining the holdout prime counts.

## Statistics
For each block B_i^(b), use
mu_i=(b/phi(b)) sum over n in B_i with gcd(n,b)=1 of 1/log n.

For k=1,2,3:
S_(b,k)=1/(M_b−k) sum_i (P_i−mu_i)(P_(i+k)−mu_(i+k)).
K_(b,k)=1/(M_b−k) sum_i Cov_model(C_i,C_(i+k)),
where each block covariance is calculated from the exact finite local product over p≤613, using the actual integer logarithms.

Compare |S_observed−K| with the simulated |S_simulated−K|. Report analytic K, observed S, simulation mean and SD, simulation-mean diagnostic in Monte Carlo standard errors, observed standardized discrepancy, and two-sided plus-one Monte Carlo p-value.

## Simulation and multiplicity
Run 5,000 replicates for each b=10,30,210. Use fixed seeds:
- b=10: 2026112810
- b=30: 2026112830
- b=210: 20261128210

Nine marginal tests (3 b values × 3 lags); report Bonferroni-adjusted minimum p-value. Do not compute a joint maximum-statistic p-value from independent b-specific streams. No post-hoc lag selection.

## Validation
- Independently generate and validate the prime list; record count, first and last prime.
- Assert interval length and alignment for each b.
- Assert active-offset count equals phi(b), all q_n in (0,1], pair-difference indices in range, and block totals agree with the independent prime count.
- Check simulated means against analytic K and report discrepancies.
- Preserve all raw and summarized output.

## Interpretation
This is a larger holdout replication of a finite model comparison, not a test of a newly proposed prime law. A non-significant result means only that these nine statistics did not detect a departure from the specified finite model. It does not prove independence, the model, or the full Hardy–Littlewood conjecture. Any small p-value is a model discrepancy requiring independent diagnosis and another pre-specified holdout, not a discovery claim.

## Deviations
Any changes after inspecting the interval's prime counts must be recorded explicitly. Do not change interval, cutoff, block lengths, lags, replicate count, seeds or test tails.
