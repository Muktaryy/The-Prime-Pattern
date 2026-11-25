// Experiment 19: pre-registered +1 transition test, 60001-70000.
// Run: node analysis/experiment_19_plus_one_transition.js
// Protocol: research/experiment_19_protocol.md
"use strict";
const START=60001,END=70000,BLOCKS=1000,REPS=100000,SEED=20261216;
const SMALL_PRIMES=[2,3,5,7,11,13,17,19,23,29,31];
const C=SMALL_PRIMES.reduce((a,p)=>a*p/(p-1),1);
function mulberry32(a){return function(){let t=a+=0x6D2B79F5;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;}}
function sieve(limit){const composite=new Uint8Array(limit+1);for(let p=2;p*p<=limit;p++)if(!composite[p])for(let m=p*p;m<=limit;m+=p)composite[m]=1;return composite;}
function deltaFromCounts(cs){
 let a=0,x=0,b=0,y=0;
 for(let w=0;w<20;w++){const base=w*50,d=[];for(let i=0;i<49;i++)d.push(cs[base+i+1]-cs[base+i]);for(let i=0;i<48;i++){if(d[i]===1){a++;if(d[i+1]<0)x++;}else{b++;if(d[i+1]<0)y++;}}}
 if(!a||!b)return null;
 return {a,x,b,y,rateAfterPlusOne:x/a,rateOther:y/b,delta:x/a-y/b};
}
const composite=sieve(END),primes=[],counts=new Uint8Array(BLOCKS),candidates=[];
for(let n=START;n<=END;n++){if(!composite[n])primes.push(n);let eligible=true;for(const p of SMALL_PRIMES)if(n%p===0){eligible=false;break;}if(eligible)candidates.push([Math.floor((n-START)/10),C/Math.log(n)]);}
for(const p of primes)counts[Math.floor((p-START)/10)]++;
if(primes.length!==878||primes[0]!==60013||primes.at(-1)!==69997)throw new Error("Prime-data validation failed");
const observed=deltaFromCounts(counts);if(!observed)throw new Error("Observed primary statistic undefined");
const rng=mulberry32(SEED),simulated=[];let exceed=0,undefinedSimulations=0;
for(let r=0;r<REPS;r++){const cs=new Uint8Array(BLOCKS);for(const [bi,q] of candidates)if(rng()<q)cs[bi]++;const d=deltaFromCounts(cs);if(d===null){undefinedSimulations++;continue;}simulated.push(d.delta);if(d.delta>=observed.delta)exceed++;}
simulated.sort((a,b)=>a-b);const mean=simulated.reduce((s,v)=>s+v,0)/simulated.length;
const result={experiment:19,range:[START,END],actualPrimeCount:primes.length,observed,model:{smallPrimes:SMALL_PRIMES,C,mean,median:simulated[Math.floor((simulated.length-1)*.5)],central95:[simulated[Math.floor((simulated.length-1)*.025)],simulated[Math.floor((simulated.length-1)*.975)]],exceedances:exceed,simulations:REPS,undefinedSimulations,upperTailPlusOne:(exceed+1)/(REPS+1),seed:SEED,generator:"Mulberry32"}};
console.log(JSON.stringify(result,null,2));
