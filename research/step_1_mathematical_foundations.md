# Step 1 — Mathematical foundations

Date: 2026-11-26  
Project: The Prime Pattern  
Status: Learning foundation; no new experiment approved by this note.

## Research question

We study whether prime counts in neighbouring, fixed-alignment, non-overlapping intervals show relationships beyond those predicted by an explicitly stated arithmetic model.

## 1. Prime density: the Prime Number Theorem

Let \(\pi(x)\) be the number of primes not exceeding \(x\). The Prime Number Theorem states

\[
\pi(x)\sim \frac{x}{\log x}.
\]

This gives an average density scale of about \(1/\log x\) near a large value \(x\). It predicts average counts over sufficiently large ranges; it does not identify the exact next prime or determine the local fluctuations in short fixed intervals.

For an interval of length \(h\) near \(x\), the first-order heuristic is about \(h/\log x\) primes. This is an approximation, not an exact probability law for the actual primes.

## 2. Hardy–Littlewood prime-pair conjecture

For a fixed positive even integer \(d\), the prime-pair conjecture predicts

\[
\#\{p\le x: p\text{ and }p+d\text{ are prime}\}
\sim 2C_2\,\mathfrak S_2(d)\frac{x}{(\log x)^2},
\]

where

\[
C_2=\prod_{p>2}\left(1-\frac{1}{(p-1)^2}\right),
\qquad
\mathfrak S_2(d)=\prod_{\substack{p\mid d\\p>2}}\frac{p-1}{p-2}.
\]

The product is over primes. If \(d\) is odd and greater than 1, two numbers at distance \(d\) cannot both be prime, apart from the exceptional pair involving 2. For even \(d\), the singular-series factor accounts for additional divisibility restrictions from small primes.

This is a conjectural asymptotic prediction, not a proved theorem for all fixed gaps.

## 3. Why the singular series matters

Primes are not independent random integers. For example, every prime greater than 2 is odd, so two such primes must have an even difference. Other small primes create further local restrictions.

The singular series adjusts the predicted frequency of a prime pair according to these restrictions. It is an arithmetic correction factor, not a mysterious pattern detector.

## 4. Connection to our block-count research

For a fixed block length \(b\), define aligned blocks

\[
B_i=\{a_0+ib,\ldots,a_0+(i+1)b-1\}
\]

and let \(C_i\) be the number of primes in \(B_i\).

Our earlier work studied relationships between neighbouring counts, including residual products such as

\[
(C_i-\mu_i)(C_{i+k}-\mu_{i+k}),
\]

where \(\mu_i\) is the model's expected count in block \(i\).

A key detail is fixed alignment: only offsets coprime to \(b\) can contain primes greater than every prime divisor of \(b\). Pair correlations between two blocks therefore need to sum over the actual eligible offsets in those blocks. A sliding-interval formula that averages over all alignments cannot automatically be applied to our fixed partition.

## 5. What this foundation does and does not establish

- The Prime Number Theorem gives a first-order average density.
- Hardy–Littlewood gives conjectural predictions for fixed prime tuples, including pairs.
- The singular series accounts for local divisibility obstructions.
- These results do not by themselves give an exact distribution for our finite block-count covariance statistics.
- Any comparison with our data must derive the expected statistic for the exact block alignment, interval, and model being tested.

## Sources for study

- J. B. Rosser and L. Schoenfeld / standard analytic number theory references for prime-counting estimates.
- G. H. Hardy and J. E. Littlewood, *Some Problems of 'Partitio Numerorum';* the prime-pair and prime-tuple conjectures.
- H. L. Montgomery and R. C. Vaughan, *Multiplicative Number Theory I: Classical Theory*, for prime distribution in arithmetic progressions and related foundations.

## Step 1 checkpoint

Before moving to Step 2, we should be able to explain in our own words:
1. What the Prime Number Theorem predicts.
2. Why prime-pair probabilities need arithmetic correction factors.
3. What the singular series represents.
4. Why fixed block alignment matters for our covariance calculations.

No claim of a new prime pattern is made in this note.
