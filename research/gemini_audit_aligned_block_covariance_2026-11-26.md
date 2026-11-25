# Independent review of Gemini's Hardy–Littlewood block-covariance audit

**Date:** 2026-11-26  
**Status:** Partial acceptance. The alignment objection is valid; the replacement framework is promising but contains unverified and overclaimed steps. No experiment is approved yet.

## Executive verdict

Gemini correctly identified that the earlier all-offset formula was not the right formula for the project's fixed block alignment. For a fixed progression of block starts (a_i=a_0+ib), the relevant prime-pair problem is a pair of linear forms in the block index (i), and the admissible offsets within a block are restricted by (gcd(a_0+r,b)=1).

The repaired fixed-alignment pair-correlation formula is structurally correct as a **Hardy–Littlewood/Bateman–Horn heuristic**, provided its singular series is defined precisely and the averaging variable, local factors, and prime exceptions are handled consistently.

However, Gemini's audit is not ready to serve as a preregistration. The main remaining issues are:

1. It applies the Montgomery–Soundararajan growing-interval variance asymptotic to fixed block lengths (b=30,210), which is not justified by that theorem/regime.
2. It presents approximate lag correlations from that asymptotic as if they were usable finite-(b) predictions. The exact fixed-(b) predictions require direct evaluation of the aligned finite singular-series sums.
3. Its numerical power calculations inherit those unverified effect sizes and use an approximate white-noise/Bartlett variance. They are planning illustrations, not validated power estimates.
4. The Banks–Ford–Tao random sieve is a real and relevant model, but forcing the forbidden residue to be (0mod p) for (pmid b) creates a **conditioned/adapted version** of their model. It is not simply the original BFT model unchanged.
5. HAC standard errors and block bootstrap intervals for the deterministic prime sequence are not automatically frequentist confidence intervals. Their interpretation requires an explicit stochastic/stationarity assumption.
6. The claim that prime-pair asymptotics have been “verified” to (10^{18}) is too strong. Computations of finite prime-pair counts are not verification of the Hardy–Littlewood asymptotic conjecture.

## 1. Fixed-alignment formula: correction accepted, with precise conditions

Let blocks be
[
B_i={a_0+ib,ldots,a_0+ib+b-1}.
]
Write (r,sin{0,ldots,b-1}), and define the active offsets
[
R={r:gcd(a_0+r,b)=1}.
]
For (r
otin R), the corresponding integer is divisible by a prime dividing (b) for every (i), apart from the finite exceptional case where the integer itself equals that prime. Those slots contribute no primes asymptotically.

For (rin R), consider the two linear forms in (i):
[
L_1(i)=bi+a_0+r,qquad
L_2(i)=bi+a_0+kb+s.
]
Their difference is (d=kb+s-r>0) for (kge1).

For each prime (pmid b), both forms are fixed nonzero residues modulo (p). The local probability that both avoid divisibility by (p) is 1. For (p
mid b), (i) ranges over all residues modulo (p), and the number of forbidden residue classes is (
u_p(d)=1) if (pmid d), and 2 otherwise. The pair singular series for this two-form progression is therefore
[
mathfrak S_b(d)=
prod_{p
mid b}
rac{1-
u_p(d)/p}{(1-1/p)^2},
]
with zero when a local factor vanishes.

The one-point progression density is
[
alpha_b(x)=rac{b}{phi(b)log x}
]
to first order, for each fixed active offset. Thus, conditional on the Hardy–Littlewood prime-pair conjecture for these linear forms and an appropriate uniformity range,
[
mathbb E[X_{L_1}X_{L_2}]
sim alpha_b(x)^2mathfrak S_b(d),
]
and
[
operatorname{Cov}(X_{L_1},X_{L_2})
sim alpha_b(x)^2(mathfrak S_b(d)-1).
]
Summing over active offsets gives
[
operatorname{Cov}(C_i,C_{i+k})
sim
left(rac{b}{phi(b)log x}ight)^2
sum_{r,sin R}
ig(mathfrak S_b(kb+s-r)-1ig).
]
This is the appropriate first-order aligned formula, not the previous unrestricted sum over every (r,sin{0,ldots,b-1}).

**Caveats:** This is an averaged asymptotic over the block index, not an assertion that each individual block has a probabilistic mean depending only on (x). The local density factor varies slowly with (x). The formula also omits lower-order terms and finite-range errors. For (b=10), the fixed progression's interaction with primes (p
mid b), especially (p=3), produces phase structure that must be treated explicitly in finite-window analysis.

## 2. Variance formula

The exact algebraic identity is
[
operatorname{Var}(C_i)=
sum_{rin R}operatorname{Var}(X_{a_i+r})
+2sum_{substack{r,sin R\r<s}}
operatorname{Cov}(X_{a_i+r},X_{a_i+s}).
]
For an active slot with one-point probability (alpha_b(x)), the diagonal contribution is (alpha_b-alpha_b^2), not simply (alpha_b). For distinct active offsets the pair term is governed heuristically by the same progression singular series, now with difference (s-r):
[
operatorname{Var}(C_i)
approx |R|alpha_b- |R|alpha_b^2
+2alpha_b^2
sum_{substack{r,sin R\r<s}}
(mathfrak S_b(s-r)-1).
]
This is a first-order structural expression, not a fully justified finite-(x) variance formula. It assumes the same progression prime-pair asymptotics and requires care for small prime exceptions and local variation across the block.

For a formal derivation, retain the exact decomposition in terms of one- and two-point probabilities first; substitute conjectural asymptotics only afterward.

## 3. The Montgomery–Soundararajan extrapolation is not justified for fixed b

Montgomery and Soundararajan's 2004 paper studies (psi(x+H)-psi(x)) in a growing-(H) regime such as (N^deltale Hle N^{1-delta}), and develops evidence for a variance of order (Hlog(N/H)). This does not directly give a finite-(b) covariance formula for (b=30) or (210) held fixed while (x	oinfty).

Gemini uses a refined variance expression involving (h(log h+C_0)/(log x)^2), then applies finite differences to obtain lag-1, lag-2, and lag-3 covariance constants. The finite-difference algebra is plausible **if** that variance expansion is valid uniformly for the interval lengths (b,2b,3b,4b) under consideration. But the cited Montgomery–Soundararajan regime does not establish that for fixed (b).

For fixed (b), the direct route is the aligned finite singular-series sum above. The numerical values and even the signs for each specific (b,a_0,k) must be obtained by evaluating those sums. Do not label the MS-derived constants as the fixed-block Hardy–Littlewood prediction.

Reference: Montgomery & Soundararajan, *Primes in Short Intervals* (2004), https://arxiv.org/abs/math/0409258 and https://doi.org/10.1007/s00220-004-1222-4.

## 4. Banks–Ford–Tao random sieve: relevant, but adaptation must be explicit

The paper is real:
William Banks, Kevin Ford, Terence Tao, *Large prime gaps and probabilistic models*, Inventiones Mathematicae 233 (2023), 1471–1518, published 14 June 2023, https://doi.org/10.1007/s00222-023-01199-0.

The paper defines a random sifted set by choosing an independent uniform forbidden residue class (a_pmod p) for each prime (ple z), and retaining integers avoiding all these classes. It chooses (z=z(t)) so that
[
Theta_z^{-1}=prod_{ple z}(1-1/p)^{-1}lelog t,
]
with (z(t)sim t^{1/e^gamma}). The paper explains that this model is designed to reproduce Hardy–Littlewood tuple correlations over an appropriate range.

Gemini's proposed instruction to force (a_p=0mod p) for (pmid b) is a natural conditioning/adaptation if the experiment is restricted to the active progression classes. But it is not the original unconditioned BFT random model. Any implementation must state:
- which primes (pmid b) are conditioned to have forbidden class zero;
- how the exceptional prime equal to an integer is treated;
- whether the model is sampled once globally or independently per range;
- how the varying cutoff (z(n)) is handled for two nearby integers;
- how the active progression's marginal density is normalized;
- what pair probabilities the adapted model actually produces.

The source itself says the model's random residue classes are shared across integers, so the resulting indicators are dependent. It is not independent Bernoulli thinning. It is a candidate model for simulation, but it must be derived and tested separately before use.

Primary source: https://link.springer.com/article/10.1007/s00222-023-01199-0 (especially §§1.3 and 1.5).

## 5. Detrending and covariance estimation

The slow change in (1/log x) must be handled. But distinguish:
- the smooth location-dependent density trend;
- the arithmetic phase structure caused by primes not dividing (b);
- the pair covariance that remains after the intended centering.

For (b=10), phase effects modulo 3 and 7 are especially important. A single smooth (operatorname{li})-based mean will not remove all local arithmetic phase effects. The experiment must decide whether its estimand is:
(a) the unconditional covariance along the fixed block sequence, including phase covariance, or
(b) covariance after conditioning/detrending on specified residue phases.

Those are different statistics and need different null predictions. For (b=30) and (210), the primes dividing (b) are removed from the active progression, but primes not dividing (b) can still induce phase patterns.

A local mean such as
[
mu_i=sum_{nin B_i, (n,b)=1}rac{b}{phi(b)log n}
]
is not necessarily the complete phase-conditioned mean when the sequence is considered modulo additional primes. If the intended model includes a finite sieve modulus (Q), phase conditioning should use the actual residue of the block start modulo (Q), or the null simulation should reproduce it directly.

## 6. Statistical inference and power

Gemini's approximate sample-size calculations use a white-noise-like standard error (operatorname{SE}(hatho_k)approx1/sqrt N) with a Bartlett adjustment. This is a useful rough planning calculation, but it is not a validated power analysis for:
- deterministic prime data;
- a nonzero null autocorrelation;
- a phase-conditioned process;
- the adapted BFT random sieve;
- nine simultaneous block-length/lag comparisons.

The actual power study must simulate the complete proposed estimator under the exact null and specified alternatives, including detrending, phase treatment, finite boundaries, and multiplicity correction. If the target is to distinguish the full singular series from a truncated (z=31) model, the effect size must be computed from the actual finite aligned sums, not guessed as (Deltahoapprox0.005).

HAC and block-bootstrap methods can be useful descriptive sensitivity analyses, but a deterministic sequence of primes does not automatically provide a stochastic sampling framework. Their confidence intervals need an explicit probabilistic interpretation. Prefer null calibration using a specified stochastic model, and describe all such conclusions as conditional on that model.

## 7. Claims to reject or qualify

- **“The MS asymptotic gives these exact fixed-block lag constants.”** Not established; fixed (b) is outside the cited growing-(H) regime.
- **“The approximate correlations are already reliable enough to set power.”** Not until the fixed-alignment singular-series sums are evaluated.
- **“BFT random sieve exactly solves the simulation problem.”** It is a promising model, but the proposed conditioning on (pmid b) is an adaptation and requires a separate derivation.
- **“HAC gives valid confidence intervals on the deterministic primes.”** Not without a stochastic interpretation.
- **“Prime-pair asymptotics have been verified to (10^{18}).”** Finite computational counts are not verification of an asymptotic conjecture.
- **“This is a stronger discovery direction.”** It is a more mathematically grounded model-comparison direction, but not a claim of discovery or novelty.

## 8. Recommended next step

Do not start Experiment 23 yet. First make a small, auditable mathematical appendix with:
1. the exact active set (R) for each (b,a_0);
2. the exact progression singular series (mathfrak S_b(d));
3. the aligned finite sums for lags 1–3 and within-block variance;
4. independent numerical evaluation of the Euler products and tail error;
5. separate results for (b=10,30,210);
6. an explicit choice between unconditional fixed-alignment covariance and phase-conditioned covariance;
7. a derivation of the adapted BFT random-sieve pair probabilities, or omission of BFT from the first experiment.

Only after those values are independently reproduced should the team compute power, choose ranges, and preregister a single primary test.

## Sources

- Banks, Ford & Tao (2023), *Large prime gaps and probabilistic models*, Inventiones Mathematicae 233, 1471–1518. https://doi.org/10.1007/s00222-023-01199-0
- Montgomery & Soundararajan (2004), *Primes in Short Intervals*. https://arxiv.org/abs/math/0409258
- Gallagher (1976), *On the Distribution of Primes in Short Intervals*. https://www.cambridge.org/core/services/aop-cambridge-core/content/view/DCE557AC8750333E68426FCEEC11858C/S0025579300016442a.pdf/div-class-title-on-the-distribution-of-primes-in-short-intervals-div.pdf

**Final status:** Gemini's alignment correction is accepted. Its proposed aligned pair formula is a promising conditional heuristic. The MS-based fixed-block numerical correlations, power calculations, and adapted BFT simulation are not yet approved.
