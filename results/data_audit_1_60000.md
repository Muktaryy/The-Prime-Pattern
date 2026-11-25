# Derived prime archive audit: 1–60,000

## Source and method
All outputs are generated independently with the Sieve of Eratosthenes by `analysis/build_prime_archives.js`. The script uses only Node.js built-ins and can be run from the repository root with:

```bash
node analysis/build_prime_archives.js
```

## Validation checks
- Inclusive integer range: 1–60,000
- Prime count: **6,057**
- First prime: **2**
- Last prime: **59,999**
- Consecutive-prime gaps: **6,056**
- Feature rows: **6,057**, one per prime
- Residue summary: primes greater than 5 for modulus 30; primes greater than 7 for modulus 210

The count agrees with the project's existing complete prime archive and the known value of pi(60,000). The generator also checks the count and endpoints before writing any output.

## Files
- `data/prime_features_1_60000.csv`: one row per prime, including prime index, preceding/following gap, last digit, residues modulo 30 and 210, and offsets within aligned blocks of 10, 100, and 1,000.
- `data/prime_gaps_1_60000.csv`: one row for each consecutive pair of primes, with gap and midpoint.
- `data/prime_residue_counts_1_60000.csv`: counts by observed residue class for moduli 30 and 210.

## Interpretation caution
These are descriptive data tables, not evidence by themselves of a new prime-number law. Residues modulo 30 and 210 encode known divisibility restrictions. Any later statistical test must define its hypothesis, null model, statistic, range, and analysis choices before examining a new holdout range.
