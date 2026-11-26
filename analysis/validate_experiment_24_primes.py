from math import isqrt

LO, HI = 200341, 300511

def base_primes(limit):
    sieve = bytearray(b"\x01") * (limit + 1)
    sieve[0:2] = b"\x00\x00"
    for p in range(2, isqrt(limit) + 1):
        if sieve[p]:
            start = p * p
            sieve[start:limit + 1:p] = b"\x00" * (((limit - start) // p) + 1)
    return [p for p, flag in enumerate(sieve) if flag]

def segmented_primes(lo, hi):
    flags = bytearray(b"\x01") * (hi - lo)
    for p in base_primes(isqrt(hi - 1)):
        start = max(p * p, ((lo + p - 1) // p) * p)
        if start < hi:
            flags[start - lo:hi - lo:p] = b"\x00" * (((hi - 1 - start) // p) + 1)
    return [lo + i for i, flag in enumerate(flags) if flag and lo + i >= 2]

if __name__ == "__main__":
    primes = segmented_primes(LO, HI)
    assert len(primes) == 8027
    assert primes[0] == 200341
    assert primes[-1] == 300499
    print({"count": len(primes), "first": primes[0], "last": primes[-1]})
