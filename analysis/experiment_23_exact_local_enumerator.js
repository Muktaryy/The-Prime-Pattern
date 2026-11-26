'use strict';
// Independent exact local-residue enumeration for Experiment 23A.
// This checks finite random-sieve survival factors without Monte Carlo.

const Z=31;
const PRIMES=[2,3,5,7,11,13,17,19,23,29,31];
const CASES=[
 {b:10,pairs:[[1000001,1000013],[1000001,1000021],[1000031,1000033]]},
 {b:30,pairs:[[1000021,1000057],[1000021,1000081],[1000111,1000117]]},
 {b:210,pairs:[[1000021,1000241],[1000021,1000441],[1000651,1000661]]}
];

function reduce([a,b]) {
  function gcd(x,y) { while(y) [x,y]=[y,x%y]; return x; }
  const d=gcd(a,b);
  return [a/d,b/d];
}
function multiply([a,b],[c,d]) { return [a*c,b*d]; }
function equal([a,b],[c,d]) { return a*d===c*b; }

function localByEnumeration(p,n,m) {
  let survivors=0;
  for(let forbidden=0;forbidden<p;forbidden++) {
    if(n%p!==forbidden && m%p!==forbidden) survivors++;
  }
  return reduce([survivors,p]);
}
function localByFormula(p,n,m) {
  return reduce([p-((n-m)%p===0?1:2),p]);
}

const output=[];
for(const {b,pairs} of CASES) {
  const checks=[];
  for(const [n,m] of pairs) {
    let enumerated=[1,1], factored=[1,1];
    for(const p of PRIMES) {
      if(p>Z || b%p===0) continue;
      enumerated=multiply(enumerated,localByEnumeration(p,n,m));
      factored=multiply(factored,localByFormula(p,n,m));
    }
    enumerated=reduce(enumerated);
    factored=reduce(factored);
    if(!equal(enumerated,factored)) throw new Error("local factor mismatch");
    checks.push({
      n,m,d:m-n,
      survivalNumerator:enumerated[0].toString(),
      survivalDenominator:enumerated[1].toString(),
      verified:true
    });
  }
  output.push({b,pairChecks:checks});
}
console.log(JSON.stringify({
  test:"23A exact per-prime forbidden-residue enumeration",
  cutoff:Z,
  output
},null,2));
