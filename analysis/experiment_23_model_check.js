'use strict';

// Experiment 23A: validate the aligned finite random-sieve model.
// Node.js built-ins only. Run: node experiment_23_model_check.js

const X = 1_000_000;
const BLOCKS = 8;
const REPLICATES = 200_000;
const BATCH_SIZE = 1_000;
const Z = 31;
const SEED = 20261126;
const PRIMES = [2,3,5,7,11,13,17,19,23,29,31];
const CONFIGS = [10,30,210];

function mulberry32(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(SEED);

function gcd(a,b) { while (b) [a,b] = [b,a%b]; return a; }
function phi(n) { let r=n; for (const p of PRIMES) if (n%p===0) r-=r/p; return r; }
function theta(z) { let t=1; for (const p of PRIMES) if (p<=z) t*=1-1/p; return t; }
function eligible(n,b) { return gcd(n,b)===1; }
function activeOffsets(b) {
  const a=[];
  for(let r=0;r<b;r++) if(gcd(1+r,b)===1) a.push(r);
  return a;
}

const THETA = theta(Z);
const results = [];

for (const b of CONFIGS) {
  const BASE = Math.ceil((X-1)/b)*b + 1; // a0=1; globally aligned block start
  const Q = b/phi(b);
  if (Z < Math.max(...PRIMES.filter(p=>b%p===0))) throw new Error('cutoff too small');
  if (THETA*Math.log(X) < 1) throw new Error('thinning probability exceeds one');
  const R = activeOffsets(b);
  if (R.length !== phi(b)) throw new Error(`active-slot count mismatch for b=${b}`);
  if (BASE % b !== 1 % b) throw new Error(`block alignment mismatch for b=${b}`);

  const sums = Array(BLOCKS).fill(0);
  const sumsSq = Array(BLOCKS).fill(0);
  const cross = Array.from({length:BLOCKS},()=>Array(BLOCKS).fill(0));
  const batchLagValues = {1:[],2:[],3:[]};
  let batchSums = Array(BLOCKS).fill(0);
  let batchCross = Array.from({length:BLOCKS},()=>Array(BLOCKS).fill(0));

  // Three eligible pairs with distinct shifts, including one within-block pair.
  const pairSpecs = [
    [BASE + R[0], BASE + b + R[Math.min(1,R.length-1)]],
    [BASE + R[0], BASE + 2*b + R[0]],
    [BASE + 3*b + R[0], BASE + 3*b + R[1]]
  ].map(([n,m])=>({n,m,joint:0}));

  for (let rep=0; rep<REPLICATES; rep++) {
    // One forbidden residue per p, shared across the full simulated range.
    const forbidden = new Map();
    for (const p of PRIMES) {
      forbidden.set(p, b%p===0 ? 0 : Math.floor(rng()*p));
    }

    const counts = Array(BLOCKS).fill(0);
    const selected = new Set();
    const end = BASE + BLOCKS*b;
    for (let n=BASE; n<end; n++) {
      if (!eligible(n,b)) continue;
      let survives = true;
      for (const p of PRIMES) {
        if (p>Z || b%p===0) continue;
        if (n%p===forbidden.get(p)) { survives=false; break; }
      }
      if (!survives) continue;
      const q = 1/(THETA*Math.log(n));
      if (rng()<q) {
        selected.add(n);
        counts[Math.floor((n-BASE)/b)]++;
      }
    }

    for (let i=0;i<BLOCKS;i++) {
      sums[i]+=counts[i];
      sumsSq[i]+=counts[i]*counts[i];
      batchSums[i]+=counts[i];
      for (let j=0;j<BLOCKS;j++) {
        cross[i][j]+=counts[i]*counts[j];
        batchCross[i][j]+=counts[i]*counts[j];
      }
    }

    if ((rep+1)%BATCH_SIZE===0) {
      for(let k=1;k<=3;k++) {
        let v=0, pairs=0;
        for(let i=0;i<BLOCKS-k;i++) {
          const j=i+k;
          const cov=(batchCross[i][j]-batchSums[i]*batchSums[j]/BATCH_SIZE)/(BATCH_SIZE-1);
          v+=cov; pairs++;
        }
        batchLagValues[k].push(v/pairs);
      }
      batchSums=Array(BLOCKS).fill(0);
      batchCross=Array.from({length:BLOCKS},()=>Array(BLOCKS).fill(0));
    }

    for (const p of pairSpecs) {
      if(selected.has(p.n) && selected.has(p.m)) p.joint++;
    }
  }

  const means = sums.map(s=>s/REPLICATES);
  const empiricalVars = sums.map((s,i)=>sumsSq[i]/REPLICATES-means[i]**2);
  const empiricalCov = (i,j)=>cross[i][j]/REPLICATES-means[i]*means[j];

  const mu = Array.from({length:BLOCKS},(_,i)=>
    R.reduce((acc,r)=>acc+Q/Math.log(BASE+i*b+r),0)
  );

  const blockCovTheory = (i,j) => {
    let total=0;
    for(const r of R) for(const s of R) {
      const n=BASE+i*b+r, m=BASE+j*b+s;
      if(n===m) {
        const p=Q/Math.log(n);
        total += p*(1-p);
      } else {
        let joint=1;
        for(const p of PRIMES) {
          if(p>Z || b%p===0) continue;
          joint *= 1-(((m-n)%p===0)?1:2)/p;
        }
        const jointProb=joint/(THETA*THETA*Math.log(n)*Math.log(m));
        total += jointProb-(Q/Math.log(n))*(Q/Math.log(m));
      }
    }
    return total;
  };

  const blockVarTheory = i => {
    let v=0;
    for(const r of R) {
      const n=BASE+i*b+r, p=Q/Math.log(n);
      v+=p*(1-p);
    }
    for(let a=0;a<R.length;a++) for(let c=a+1;c<R.length;c++) {
      const n=BASE+i*b+R[a], m=BASE+i*b+R[c];
      let joint=1;
      for(const p of PRIMES) {
        if(p>Z || b%p===0) continue;
        joint *= 1-(((m-n)%p===0)?1:2)/p;
      }
      const jp=joint/(THETA*THETA*Math.log(n)*Math.log(m));
      v+=2*(jp-(Q/Math.log(n))*(Q/Math.log(m)));
    }
    return v;
  };

  let maxMeanAbs=0, maxMeanZ=0, maxVarAbs=0;
  for(let i=0;i<BLOCKS;i++) {
    const diff=Math.abs(means[i]-mu[i]);
    maxMeanAbs=Math.max(maxMeanAbs,diff);
    const se=Math.sqrt(Math.max(empiricalVars[i],0)/REPLICATES);
    maxMeanZ=Math.max(maxMeanZ,diff/(se||1e-15));
    maxVarAbs=Math.max(maxVarAbs,Math.abs(empiricalVars[i]-blockVarTheory(i)));
  }

  const lagSummaries=[];
  for(let k=1;k<=3;k++) {
    let e=0,t=0;
    for(let i=0;i<BLOCKS-k;i++) {
      e+=empiricalCov(i,i+k);
      t+=blockCovTheory(i,i+k);
    }
    const batchVals=batchLagValues[k];
    const batchMean=batchVals.reduce((a,v)=>a+v,0)/batchVals.length;
    const batchVar=batchVals.reduce((a,v)=>a+(v-batchMean)**2,0)/(batchVals.length-1);
    const mcse=Math.sqrt(batchVar/batchVals.length);
    lagSummaries.push({
      lag:k, empiricalAverage:e/(BLOCKS-k), exactAverage:t/(BLOCKS-k),
      absoluteError:Math.abs(e-t)/(BLOCKS-k), batchMonteCarloSE:mcse,
      zScore:(e/(BLOCKS-k)-t/(BLOCKS-k))/mcse
    });
  }

  const pairChecks=pairSpecs.map(p=>{
    const d=p.m-p.n;
    let local=1;
    for(const prime of PRIMES) {
      if(prime<=Z && b%prime!==0) local*=1-(((d%prime)===0)?1:2)/prime;
    }
    const theoretical=local/(THETA*THETA*Math.log(p.n)*Math.log(p.m));
    const frequency=p.joint/REPLICATES;
    const se=Math.sqrt(theoretical*(1-theoretical)/REPLICATES);
    return {
      n:p.n,m:p.m,d,jointFrequency:frequency,theoreticalJointProbability:theoretical,
      absoluteError:Math.abs(frequency-theoretical),monteCarloSE:se,
      zScore:(frequency-theoretical)/se
    };
  });

  results.push({
    b, rangeStart:BASE, phi:phi(b), Q, activeSlots:R.length, cutoff:Z, thetaZ:THETA,
    thinningAtX:1/(THETA*Math.log(X)), replicates:REPLICATES,
    maxAbsoluteBlockMeanError:maxMeanAbs, maxMeanStandardizedError:maxMeanZ,
    maxAbsoluteBlockVarianceError:maxVarAbs, lagCovariances:lagSummaries, pairChecks
  });
}

const output={
  experiment:'23A aligned finite random-sieve validation',seed:SEED,
  minimumRangeStart:X,blocks:BLOCKS,cutoff:Z,thetaZ:THETA,replicates:REPLICATES,results
};
console.log(JSON.stringify(output,null,2));
