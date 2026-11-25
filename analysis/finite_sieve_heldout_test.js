#!/usr/bin/env node
"use strict";
// Experiment 17: finite-sieve independent model on the previously unused range 40001-50000.
// Exclude multiples of primes <=31; independently retain each survivor with probability C31/log(n).
// C31 = product over primes p<=31 of p/(p-1). This is a finite-sieve baseline, not a full sieve model.
const START=40001, END=50000, BLOCKS=1000, REPS=100000, SEED=20261214;
const SMALL_PRIMES=[2,3,5,7,11,13,17,19,23,29,31];
const C=SMALL_PRIMES.reduce((a,p)=>a*p/(p-1),1);
function mulberry32(a){return function(){let t=a+=0x6D2B79F5;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;}}
function sieve(limit){const composite=new Uint8Array(limit+1);for(let p=2;p*p<=limit;p++)if(!composite[p])for(let m=p*p;m<=limit;m+=p)composite[m]=1;return composite;}
function excludedBySmallPrime(n){for(const p of SMALL_PRIMES)if(n%p===0)return true;return false;}
const composite=sieve(END), observedCounts=[], probabilities=[];
let actualPrimeCount=0, expectedPrimeCount=0;
for(let b=0;b<BLOCKS;b++){
  let actual=0; const blockProbabilities=[];
  for(let n=START+10*b;n<START+10*b+10;n++){
    if(!composite[n])actual++;
    if(!excludedBySmallPrime(n)){
      const q=C/Math.log(n);
      if(!(q>0&&q<1))throw new Error("Invalid Bernoulli probability at n="+n);
      blockProbabilities.push(q); expectedPrimeCount+=q;
    }
  }
  observedCounts.push(actual); probabilities.push(blockProbabilities); actualPrimeCount+=actual;
}
let observedStatistic=0;
for(let w=0;w<20;w++)for(let i=1;i<50;i++)
  observedStatistic+=Math.abs(observedCounts[w*50+i]-observedCounts[w*50+i-1]);
const rng=mulberry32(SEED), stats=new Int32Array(REPS), totals=new Int32Array(REPS);
let statisticExceedances=0,totalExceedances=0;
for(let r=0;r<REPS;r++){
  const blockCounts=new Uint8Array(BLOCKS);let total=0;
  for(let b=0;b<BLOCKS;b++){
    let count=0;for(const q of probabilities[b])if(rng()<q)count++;
    blockCounts[b]=count;total+=count;
  }
  let statistic=0;
  for(let w=0;w<20;w++)for(let i=1;i<50;i++)
    statistic+=Math.abs(blockCounts[w*50+i]-blockCounts[w*50+i-1]);
  stats[r]=statistic;totals[r]=total;
  if(statistic>=observedStatistic)statisticExceedances++;
  if(total>=actualPrimeCount)totalExceedances++;
}
function summarize(values){
  const sorted=Array.from(values).sort((a,b)=>a-b);
  let sum=0;for(const x of values)sum+=x;
  return {mean:sum/values.length,median:sorted[Math.floor((values.length-1)*0.5)],
    low:sorted[Math.floor((values.length-1)*0.025)],high:sorted[Math.floor((values.length-1)*0.975)]};
}
console.log(JSON.stringify({
  range:"40001-50000",smallPrimes:SMALL_PRIMES,conditionalDensityFactor:C,
  actualPrimeCount,expectedPrimeCount,observedStatistic,
  statistic:summarize(stats),statisticUpperExceedances:statisticExceedances,
  statisticUpperTailPlusOne:(statisticExceedances+1)/(REPS+1),
  totalCount:summarize(totals),totalCountUpperExceedances:totalExceedances,
  totalCountUpperTailPlusOne:(totalExceedances+1)/(REPS+1),
  blockSize:10,windows:20,windowSize:500,adjacentPairs:980,repetitions:REPS,seed:SEED
},null,2));
