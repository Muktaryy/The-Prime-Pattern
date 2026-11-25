#!/usr/bin/env node
"use strict";
// Experiment 16: untouched-range test of the fixed Experiment 15 smooth-density baseline.
// Range 30,001–40,000; 100,000 simulations; Mulberry32 seed 20261213.
const START=30001, BLOCKS=1000, REPETITIONS=100000, SEED=20261213;
function mulberry32(a){return function(){let t=a+=0x6D2B79F5;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;}}
function gcd(a,b){while(b)[a,b]=[b,a%b];return a;}
function sieve(limit){const c=new Uint8Array(limit+1);for(let p=2;p*p<=limit;p++)if(!c[p])for(let m=p*p;m<=limit;m+=p)c[m]=1;return c;}
const composite=sieve(40000), counts=[], candidates=[];let actualTotal=0, expectedTotal=0;
for(let b=0;b<BLOCKS;b++){let count=0;const ps=[];for(let n=START+10*b;n<START+10*b+10;n++){if(n>=2&&!composite[n])count++;if(n>7&&gcd(n,210)===1){const p=210/(48*Math.log(n));ps.push(p);expectedTotal+=p;}}counts.push(count);actualTotal+=count;candidates.push(ps);}
let observed=0;for(let w=0;w<20;w++)for(let i=1;i<50;i++)observed+=Math.abs(counts[w*50+i]-counts[w*50+i-1]);
const random=mulberry32(SEED), stats=new Int32Array(REPETITIONS), totals=new Int32Array(REPETITIONS);let exceed=0;
for(let r=0;r<REPETITIONS;r++){const bc=new Int8Array(BLOCKS);let total=0;for(let b=0;b<BLOCKS;b++){let c=0;for(const p of candidates[b])if(random()<p)c++;bc[b]=c;total+=c;}let t=0;for(let w=0;w<20;w++)for(let i=1;i<50;i++)t+=Math.abs(bc[w*50+i]-bc[w*50+i-1]);stats[r]=t;totals[r]=total;if(t>=observed)exceed++;}
function summary(a){const s=Array.from(a).sort((x,y)=>x-y);return{mean:a.reduce((x,y)=>x+y,0)/a.length,median:s[Math.floor((a.length-1)*.5)],low:s[Math.floor((a.length-1)*.025)],high:s[Math.floor((a.length-1)*.975)]};}
console.log(JSON.stringify({range:"30001-40000",actualPrimeCount:actualTotal,expectedPrimeCount:expectedTotal,observedStatistic:observed,statistic:summary(stats),upperExceedances:exceed,upperTailPlusOne:(exceed+1)/(REPETITIONS+1),totalCount:summary(totals),seed:SEED,repetitions:REPETITIONS},null,2));
