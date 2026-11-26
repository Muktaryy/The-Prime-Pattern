from math import gcd, isqrt, log
import csv, json

LO, HI, B, Z = 720511, 2820511, 210, 613

def base_primes(n):
    flags = bytearray(b"\x01") * (n + 1)
    flags[0:2] = b"\x00\x00"
    for p in range(2, isqrt(n) + 1):
        if flags[p]:
            flags[p*p:n+1:p] = b"\x00" * (((n-p*p)//p)+1)
    return [i for i, v in enumerate(flags) if v]

def segmented_primes(lo, hi):
    flags = bytearray(b"\x01") * (hi-lo)
    for p in base_primes(isqrt(hi-1)):
        start = max(p*p, ((lo+p-1)//p)*p)
        if start < hi:
            flags[start-lo:hi-lo:p] = b"\x00" * (((hi-1-start)//p)+1)
    return [lo+i for i,v in enumerate(flags) if v and lo+i >= 2]

def validate():
    primes = segmented_primes(LO, HI)
    assert len(primes) == 146713
    assert primes[0] == 720527 and primes[-1] == 2820509
    phi = sum(gcd(i, B) == 1 for i in range(1, B+1))
    assert phi == 48
    offsets = [r for r in range(B) if gcd(LO+r, B) == 1]
    small = base_primes(Z)
    theta = 1.0
    for p in small:
        theta *= 1.0 - 1.0/p
    Q = B/phi
    M = (HI-LO)//B
    counts = [0]*M
    for n in primes:
        counts[(n-LO)//B] += 1
    assert sum(counts) == len(primes)
    mu = [sum(Q/log(LO+i*B+r) for r in offsets) for i in range(M)]
    residual = [c-m for c,m in zip(counts,mu)]
    observed = sum(residual[i]*residual[i+3] for i in range(M-3))/(M-3)
    singular = []
    for d in range(1,4*B):
        v = 1.0
        for p in small:
            if B % p:
                v *= 1.0 - (1.0 if d%p == 0 else 2.0)/p
        singular.append(v)
    covariances = []
    for i in range(M-3):
        c = 0.0
        for r in offsets:
            n = LO+i*B+r
            for s in offsets:
                m = LO+(i+3)*B+s
                d = m-n
                c += singular[d-1]/(theta*theta*log(n)*log(m))-Q*Q/(log(n)*log(m))
        covariances.append(c)
    expected = sum(covariances)/(M-3)
    result = {"prime_count":len(primes), "first_prime":primes[0],
              "last_prime":primes[-1], "block_total":sum(counts),
              "observed_S":observed, "analytic_K":expected}
    assert abs(observed - (-0.25977498465126792)) < 1e-12
    assert abs(expected - (-0.17017082701158381)) < 1e-12
    return result

if __name__ == "__main__":
    print(json.dumps(validate(), indent=2))
