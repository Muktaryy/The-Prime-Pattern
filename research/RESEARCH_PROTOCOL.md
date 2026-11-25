# The Prime Pattern Project — Research Protocol

## Purpose

Investigate reproducible statistical questions about prime locations and counts at multiple scales. The project is exploratory mathematics and computational number theory. A statistical anomaly is not a proof of a new law.

## 1. Data we preserve for every covered integer range

### A. Canonical raw data
- Complete sorted list of every prime in the range.
- Exact range start and end, inclusive/exclusive convention, and integer count.
- A reproducible generation method (normally a sieve of Eratosthenes for ranges of this size).
- Validation checks: count against a trusted reference where available; every listed number is prime; every omitted integer is composite.
- File format, generation-code version, and date generated.

### B. Multiple block scales
For aligned blocks of 10, 100, and 1,000 integers, store:
- block start and end;
- number of primes;
- exact prime numbers in the block;
- zero-prime blocks as well as nonzero blocks.

Keep the alignment origin explicit (currently blocks begin at 1: 1–10, 11–20, ...). Never silently change alignment.

### C. Prime positions and gaps
Derive and save:
- ordered prime gaps (next prime minus current prime);
- gap position and the two primes defining each gap;
- twin-prime pairs (gap 2), and other explicitly defined gap classes;
- each prime's offset within its 10-, 100-, and 1,000-number block;
- residues modulo selected moduli (at minimum 2, 3, 5, 7, 30, 210 when relevant).

These are derived datasets, not replacements for the canonical prime list.

## 2. Metadata required for every dataset

Every dataset must have a small metadata record containing:
- dataset ID and version;
- inclusive start and end;
- number of integers and number of primes;
- block sizes and alignment origin;
- generation algorithm and implementation/version;
- validation method and validation result;
- source/reference for any externally supplied data;
- file paths and checksums (SHA-256 where practical).

Do not overwrite old datasets silently. Version changes and corrections must be recorded.

## 3. Metadata required for every experiment

Before running an experiment, write a protocol containing:
1. Research question and exact hypothesis.
2. Primary statistic and its mathematical definition.
3. Data range(s), inclusion rules, block alignment, and boundary handling.
4. Null model and why it is relevant.
5. Parameters and how they were chosen.
6. Primary tail direction (upper, lower, or two-sided).
7. Simulation count, random-number generator, seed, and software version.
8. Planned comparisons, secondary analyses, and multiple-testing correction.
9. What result would count as evidence against the hypothesis.
10. Known limitations and possible confounders.

After running it, record:
- observed statistic and sample size;
- null-model mean, median, spread, and quantiles;
- exceedance count and Monte Carlo p-value with +1 correction;
- effect size and uncertainty interval where appropriate;
- all deviations from the protocol;
- interpretation, limitations, and next decision.

A p-value is not the probability that a hypothesis is true. Monte Carlo p-values describe extremeness under the specified simulation model only.

## 4. Code and reproducibility

For every analysis:
- save source code, exact command to run it, language/runtime version, dependencies, and seed;
- keep scripts separate from data and written reports;
- make scripts read saved data rather than relying on values copied into code;
- include assertions for expected row counts, range endpoints, and totals;
- rerun the script from a clean checkout when possible;
- record output in a machine-readable results file as well as the README/research report.

Use deterministic seeds for reproducibility, but do not mistake reproducibility for independent validation. For simulations, use an appropriate random generator and document it.

## 5. Statistical safeguards

- Define one primary hypothesis and statistic before examining a new holdout range.
- Keep exploratory analysis separate from confirmatory tests.
- Do not repeatedly change the statistic, window size, modulus, or tail direction and report only the most striking result.
- If many tests are explored, report all of them and account for multiple comparisons (for example, Holm correction or a suitable false-discovery procedure).
- Use untouched holdout ranges for confirmation.
- Compare more than one defensible null model. Preserve arithmetic constraints such as small-prime divisibility when relevant.
- Check sensitivity to block alignment, scale, and window boundaries, but label these as secondary analyses unless pre-registered.
- Report negative and inconclusive results as carefully as positive ones.
- Distinguish descriptive association, model rejection, conjecture, and proof.

## 6. Project structure

- `data/raw/`: canonical prime lists and source data.
- `data/derived/`: block tables, gaps, residues, and other deterministic transformations.
- `analysis/`: executable scripts.
- `results/`: machine-readable outputs from each run.
- `research/`: protocols, literature reviews, mathematical notes, and experiment reports.

Existing files need not be moved immediately; use this structure for new work and migrate old files carefully with links preserved.

## 7. Research workflow

1. State the question in one sentence.
2. Search the mathematical literature and define exactly what is already known.
3. Write the protocol before inspecting the holdout result.
4. Generate or validate canonical data.
5. Run the pre-specified analysis.
6. Reproduce the result independently or with a second implementation for important findings.
7. Compare with stronger null models and perform sensitivity checks.
8. Publish code, data, outputs, limitations, and interpretation together.
9. Update the research log with the next decision.

## 8. Current project-specific priorities

1. Preserve exact prime identities and counts at 10, 100, and 1,000 scales.
2. Return to the original hypothesis: after a block-count difference of +1, is the next difference more often negative than under appropriate models?
3. Analyze prime gaps and offsets without conflating them with block-count transitions.
4. Strengthen null models beyond independent Bernoulli selection after a finite sieve.
5. Use pre-specified, untouched ranges for confirmation.

## 9. Standard naming and alignment

The current canonical alignment is:
- size 10: 1–10, 11–20, ...
- size 100: 1–100, 101–200, ...
- size 1,000: 1–1,000, 1,001–2,000, ...

When a range starts partway through a block, retain the global alignment and record partial edge blocks explicitly. Do not silently rebase blocks at the range start.
