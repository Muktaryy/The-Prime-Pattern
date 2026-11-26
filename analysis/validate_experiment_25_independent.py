from math import gcd, isqrt, log

LO, HI, Z = 300511, 720511, 613

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

def phi(n):
    return sum(1 for a in range(1,n+1) if gcd(a,n)==1)

def validate():
    primes = segmented_primes(LO, HI)
    assert len(primes) == 32031
    assert primes[0] == 300511 and primes[-1] == 720497
    theta = 1.0
    small = base_primes(Z)
    for p in small:
        theta *= 1.0 - 1.0/p

    b, k = 210, 3
    M = (HI-LO)//b
    Q = b/phi(b)
    offsets = [r for r in range(b) if gcd(LO+r,b)==1]
    assert len(offsets) == phi(b)
    counts = [0]*M
    for p in primes:
        counts[(p-LO)//b] += 1
    assert sum(counts) == len(primes)
    mu = [sum(Q/log(LO+i*b+r) for r in offsets) for i in range(M)]
    S = sum((counts[i]-mu[i])*(counts[i+k]-mu[i+k]) for i in range(M-k))/(M-k)

    # Independently recompute the finite local product and analytic covariance.
    sing = {}
    for d in range(1,4*b):
        v = 1.0
        for p in small:
            if b % p:
                v *= 1.0 - (1.0 if d%p==0 else 2.0)/p
        sing[d] = v
    Ksum = 0.0
    for i in range(M-k):
        block_cov = 0.0
        for r in offsets:
            n = LO+i*b+r
            for s in offsets:
                m = LO+(i+k)*b+s
                d = m-n
                joint = sing[d]/(theta*theta*log(n)*log(m))
                block_cov += joint - Q*Q/(log(n)*log(m))
        Ksum += block_cov
    K = Ksum/(M-k)
    assert abs(S-0.366324054533264) < 1e-12
    assert abs(K-(-0.202734720239661)) < 1e-12
    return {"prime_count":len(primes),"first":primes[0],"last":primes[-1],
            "b210_lag3_observed_S":S,"analytic_K":K,"residual_S_minus_K":S-K}

if __name__ == "__main__":
    print(validate())
