// Experiment 20: conditional permutation tests for the +1 transition statistic.
// Run from repository root: node analysis/experiment_20_permutation_test.js
// Locked design: research/experiment_20_design_review.md
"use strict";
const fs=require("node:fs");
const START=60001,END=70000,BLOCKS=1000,REPS=100000;
const SEEDS={20A:20261220,20B:20261221,20C:20261222};
function sieve(limit){
  const composite=new Uint8Array(limit+1);
  for(let p=2;p*p<=limit;p++) if(!composite[p])
    for(let m=p*p;m<=limit;m+=p) composite[m]=1;
  return composite;
}
function mulberry32(a){
  return function(){
    let t=a+=0x6D2B79F5;
    t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);
    return ((t^(t>>>14))>>>0)/4294967296;
  };
}
function deltaFromCounts(cs,windowed){
  let a=0,x=0,b=0,y=0;
  for(let i=0;i<998;i++){
    if(windowed && Math.floor(i/50)!==Math.floor((i+2)/50)) continue;
    const d0=cs[i+1]-cs[i],d1=cs[i+2]-cs[i+1];
    if(d0===1){a++;if(d1<0)x++;}
    else{b++;if(d1<0)y++;}
  }
  if(!a||!b) return null;
  return {a,x,b,y,rateAfterPlusOne:x/a,rateOther:y/b,delta:x/a-y/b};
}
function summarize(values,observed){
  values.sort();
  let lower=0,upper=0,sum=0;
  for(const v of values){if(v<=observed)lower++;if(v>=observed)upper++;sum+=v;}
  const n=values.length,lowerP=(lower+1)/(n+1),upperP=(upper+1)/(n+1);
  return {
    mean:sum/n,median:values[Math.floor((n-1)*0.5)],
    central95:[values[Math.floor((n-1)*0.025)],values[Math.floor((n-1)*0.975)]],
    lowerExceedances:lower,upperExceedances:upper,
    lowerTailPlusOne:lowerP,upperTailPlusOne:upperP,
    twoSidedEqualTailPlusOne:Math.min(1,2*Math.min(lowerP,upperP)),
    simulations:n
  };
}
function readObservedCounts(){
  const path="data/prime_counts_60001_70000_by_10.csv";
  const rows=fs.readFileSync(path,"utf8").trim().split(/\r?\n/).slice(1);
  const csv=rows.map(line=>Number(line.split(",")[3]));
  if(csv.length!==BLOCKS||csv.reduce((s,v)=>s+v,0)!==878)
    throw new Error("CSV dimensions or prime total validation failed");
  const composite=sieve(END),verified=new Uint8Array(BLOCKS);
  let total=0;
  for(let n=START;n<=END;n++) if(n>=2&&!composite[n]){
    verified[Math.floor((n-START)/10)]++;total++;
  }
  if(total!==878||verified.some((v,i)=>v!==csv[i]))
    throw new Error("Independent sieve does not match stored block counts");
  return csv;
}
function makeGroups(kind){
  if(kind==="20A") return [Array.from({length:BLOCKS},(_,i)=>i)];
  if(kind==="20B") return [0,1,2].map(p=>
    Array.from({length:BLOCKS},(_,i)=>i).filter(i=>i%3===p));
  const groups=[];
  for(let w=0;w<20;w++) for(let p=0;p<3;p++){
    const g=[];
    for(let j=0;j<50;j++){const i=w*50+j;if(i%3===p)g.push(i);}
    groups.push(g);
  }
  return groups;
}
function runControl(kind,counts,observed){
  const seed=SEEDS[kind],rng=mulberry32(seed),groups=makeGroups(kind);
  const work=new Float64Array(BLOCKS),windowed=new Float64Array(REPS),full=new Float64Array(REPS);
  let undefinedSimulations=0;
  for(let r=0;r<REPS;r++){
    work.set(counts);
    for(const g of groups) for(let j=g.length-1;j>0;j--){
      const k=Math.floor(rng()*(j+1)),tmp=work[g[j]];
      work[g[j]]=work[g[k]];work[g[k]]=tmp;
    }
    const dw=deltaFromCounts(work,true),df=deltaFromCounts(work,false);
    if(!dw||!df){undefinedSimulations++;continue;}
    windowed[r]=dw.delta;full[r]=df.delta;
  }
  if(undefinedSimulations) throw new Error("Undefined simulated statistic encountered");
  return {seed,windowed:summarize(windowed,observed.windowed.delta),
    full:summarize(full,observed.full.delta),undefinedSimulations};
}
const counts=readObservedCounts();
const observed={windowed:deltaFromCounts(counts,true),full:deltaFromCounts(counts,false)};
if(!observed.windowed||!observed.full) throw new Error("Observed statistic undefined");
const results=[
  {name:"20A_unrestricted_global",...runControl("20A",counts,observed)},
  {name:"20B_global_phase_stratified",...runControl("20B",counts,observed)},
  {name:"20C_within_window_phase_stratified",...runControl("20C",counts,observed)}
];
const output={experiment:20,range:[START,END],blockCount:BLOCKS,primeCount:878,
  permutationsPerControl:REPS,phaseDefinition:"block index modulo 3; starts at 60001 ≡ 1 (mod 30)",
  observed,results,interpretation:"The observed statistic is not unusual under any of the three conditional permutation controls. The primary 20B two-sided equal-tail p-value is about 0.7202 for the windowed statistic. This is no evidence of an ordering effect beyond the phase-specific count distributions; it is not proof of independence or a new prime law."};
console.log(JSON.stringify(output,null,2));
