# Independent audit: aligned singular-series sums for block lengths 10, 30, 210

Date: 2026-11-26

## Verdict

Gemini's core factorization and its numerical results for b=10 and b=30 are correct. I independently recomputed the active sets, rational pair sums, and leading coefficients. I also completed b=210 and checked the rational sum using a second divisor-convolution identity.

These are exact evaluations of finite sums of singular-series constants. Their interpretation as leading covariances of actual prime counts is conditional on Hardy–Littlewood/Bateman–Horn pair asymptotics in the relevant progressions, with suitable uniformity. They are not empirical prime-count covariances and are not theorems about actual primes.

## Formula checked

For R_b = {r in [0,b-1] : gcd(1+r,b)=1}, define

S_b(d) = product over primes p not dividing b of
(1 - nu_p(d)/p)/(1 - 1/p)^2,

where nu_p(d)=1 if p divides d and 2 otherwise.

Since b is even and d=kb+s-r is even for active r,s, all primes in the product are odd. Thus

S_b(d) = C_2^(b) f_b(d),

C_2^(b) = product over odd primes p not dividing b of (1 - 1/(p-1)^2),

f_b(d) = product over p|d, p not dividing b of (p-1)/(p-2).

If m_b=|R_b|=phi(b), then

A(b,k) = sum_{r,s in R_b} f_b(kb+s-r),

T(b,k) = C_2^(b) A(b,k) - m_b^2,

and the leading aligned covariance coefficient is

K(b,k) = (b/phi(b))^2 T(b,k),

so the conditional HL prediction is K(b,k)/(log x)^2 to leading order.

The exact divisor-convolution check uses
f_b(d) = sum_{q|d, q squarefree, gcd(q,b)=1} 1/product_{p|q}(p-2).
Summing pair counts N_q(b,k) over q reproduces A(b,k). This is an independent rearrangement of the rational calculation.

## Independently recomputed results

The following A(b,k) values are exact rationals. The displayed decimal values of T and K use C_2 = 0.660161815846869573927812110014555778432623360284.

### b = 10

R_10 = {0, 2, 6, 8}; phi(10)=4; (b/phi(b))^2=6.25; C_2^(10)=0.70417260356999421219.

| k | Exact A(b,k) | T(b,k) | K(b,k) |
|---|---:|---:|---:|
| 1 | 101/5 | -1.77571340788612 | -11.0982087992882 |
| 2 | 10397/495 | -1.20953018319752 | -7.55956364498447 |
| 3 | 208082/8415 | +1.41243537683322 | +8.82772110520762 |

### b = 30

R_30 = {0, 6, 10, 12, 16, 18, 22, 28}; phi(30)=8; (b/phi(b))^2=14.0625; C_2^(30)=0.93889680475999228292.

| k | Exact A(b,k) | T(b,k) | K(b,k) |
|---|---:|---:|---:|
| 1 | 2361067/35343 = 66 + 28429/35343 | -1.27758644924707 | -17.9660594425370 |
| 2 | 644696258/9517365 | -0.400121601207518 | -5.62671001698072 |
| 3 | 1163265774136/17299397115 | -0.865631145264956 | -12.1729379802884 |

The non-monotonicity is real in these aligned singular-series sums: K(30,3) is more negative than K(30,2).

### b = 210 — completed independently

R_210 (48 elements) is:
{0,10,12,16,18,22,28,30,36,40,42,46,52,58,60,66,70,72,78,82,88,96,100,102,106,108,112,120,126,130,136,138,142,148,150,156,162,166,168,172,178,180,186,190,192,196,198,208}.

phi(210)=48; (210/48)^2=1225/64=19.140625; C_2^(210)=0.96572242775313491957.

| k | Exact A(b,k) | T(b,k) | K(b,k) |
|---|---:|---:|---:|
| 1 | 457388454729560909303643162713261741600479 / 192373925726223625154486555051823736125 | -7.89730697545218 | -151.159391327014 |
| 2 | 138758970406977532097642898361801080948326867650198692872 / 58223743673724630172681091637816384823641257906157375 | -2.48791371302998 | -47.6202234134644 |
| 3 | 87692166690117789491666982689210131167703429871525087379101316501727159375312 / 36793326892259490593723373799992516200709084283009544267338642703337205875 | -2.32468917809982 | -44.4960037995669 |

The b=210 rational A values were checked two ways:
1. Directly sum f_b(kb+s-r) over all 48^2 ordered pairs.
2. Expand each f_b(d) over squarefree q|d, gcd(q,b)=1, and aggregate the pair counts N_q. The two exact Fraction calculations agree for all three lags. The divisor-convolution method encounters 45, 65, and 90 nontrivial q terms for k=1,2,3 respectively.

## Checks and corrections

- The b=10 and b=30 rational A values in Gemini's report are correct. In particular, 66 + 28429/35343 is exactly 2361067/35343.
- The b=210 numerical results above fill the gap Gemini correctly refused to guess.
- The no-local-obstruction argument for these three even b values is correct: every active shift d is even, and every p not dividing b is odd, so each local numerator is positive.
- The finite Euler product tail bound from summing over odd integers is a valid conservative bound. The quoted asymptotic prime-tail estimate is sharper but should be labelled asymptotic, not an unconditional finite-P bound.
- The quoted C_2 value should be treated as a high-precision numerical constant with a documented source/algorithm. The rational A values are exact and do not depend on its numerical evaluation.
- The claimed b=10 modulo-30 between-phase covariance contributions (-6.25, -6.25, +12.5) check out from the phase capacities (2,4,2) and the law of total covariance. Subtracting these from the unconditional K values gives within-phase averages -4.8482087993, -1.3095636450, and -3.6722788948. Thus the positive unconditional lag-3 coefficient is due to the phase-capacity component; the phase-detrended average is negative at all three lags.
- The statement that replacing C_2^(b) by a truncated product gives an exact covariance theorem for “any z-sieved independent thinning model” is too broad as written. It is true only after the random-sieve construction, conditioning, thinning probability, and covariance convention are specified. Independent thinning alone does not automatically produce the shared-residue pair correlations of a random sieve.
- The formula K(b,k)/(log x)^2 is a leading conjectural prime-pair prediction, not an exact finite-x identity. Secondary terms and uniformity errors are not quantified here.

## Interpretation

The finite aligned singular-series calculation predicts:
- b=10: negative lag-1 and lag-2 coefficients, positive unconditional lag-3 coefficient; modulo-30 phase detrending changes the lag-3 sign.
- b=30: all three coefficients are negative, with lag 3 more negative than lag 2.
- b=210: all three are strongly negative, with lag 1 much more negative than lags 2 and 3.

This is a mathematical prediction under the pair-correlation conjectural framework. It is not yet evidence that observed prime-count residuals follow these values. The next step, if desired, should be a separate derivation and validation of a precisely specified random-sieve model, followed by a carefully preregistered empirical comparison. Do not infer sample size or statistical power from these coefficients alone.
