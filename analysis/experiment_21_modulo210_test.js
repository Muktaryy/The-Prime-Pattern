// Experiment 21: modulo-210 phase-stratified conditional permutation tests.
// Run from repository root: node analysis/experiment_21_modulo210_test.js
"use strict";
const fs=require("node:fs");
const START=60001,END=70000,BLOCKS=1000,REPS=100000;
const SEEDS={global:20261223,withinWindow:20261224};
function sieve(limit){const c=new Uint8Array(limit+1);for(let p=2;p*p<=limit;p++)if(!c[p])for(let m=p*p;m<=limit;m+=p)c[m]=1;return c;}
function rng32(a){return()=>{let t=a+=0x6D2B79F5;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
function readCounts(){
 const rows=fs.readFileSync("data/prime_counts_60001_70000_by_10.csv","utf8").trim().split(/\r?\n/).slice(1);
 const csv=rows.map(s=>Number(s.split(",")[3]));
 if(csv.length!==BLOCKS||csv.reduce((a,b)=>a+b,0)!==878)throw Error("CSV dimensions/total mismatch");
 const composite=sieve(END),verified=new Uint8Array(BLOCKS);let total=0;
 for(let n=START;n<=END;n++)if(n>=2&&!composite[n]){verified[Math.floor((n-START)/10)]++;total++;}
 if(total!==878||verified.some((v,i)=>v!==csv[i]))throw Error("Independent sieve mismatch");
 return csv;
}
function delta(cs,windowed){
 let a=0,x=0,b=0,y=0;
 for(let i=0;i<998;i++){
  if(windowed&&Math.floor(i/50)!==Math.floor((i+2)/50))continue;
  const d0=cs[i+1]-cs[i],d1=cs[i+2]-cs[i+1];
  if(d0===1){a++;if(d1<0)x++;}else{b++;if(d1<0)y++;}
 }
 if(!a||!b)throw Error("Undefined delta");
 return{a,x,b,y,rateAfterPlusOne:x/a,rateOther:y/b,delta:x/a-y/b};
}
function summarize(values,observed){
 values.sort((a,b)=>a-b);let lower=0,upper=0,sum=0;
 for(const v of values){if(v<=observed)lower++;if(v>=observed)upper++;sum+=v;}
 const n=values.length,lp=(lower+1)/(n+1),up=(upper+1)/(n+1);
 return{mean:sum/n,median:values[Math.floor((n-1)/2)],
  central95:[values[Math.floor((n-1)*.025)],values[Math.floor((n-1)*.975)]],
  lowerExceedances:lower,upperExceedances:upper,lowerTailPlusOne:lp,upperTailPlusOne:up,
  twoSidedEqualTailPlusOne:Math.min(1,2*Math.min(lp,up)),simulations:n};
}
function phase(i){return(START+10*i)%210;}
function makeGlobalGroups(){
 const map=new Map();
 for(let i=0;i<BLOCKS;i++){const p=phase(i);if(!map.has(p))map.set(p,[]);map.get(p).push(i);}
 return[...map.values()];
}
function makeWindowGroups(){
 const groups=[];
 for(let w=0;w<20;w++){
  const map=new Map();
  for(let j=0;j<50;j++){const i=w*50+j,p=phase(i);if(!map.has(p))map.set(p,[]);map.get(p).push(i);}
  groups.push(...map.values());
 }
 return groups;
}
function run(groups,counts,observed,seed){
 const random=rng32(seed),work=new Float64Array(BLOCKS),windowed=new Float64Array(REPS),full=new Float64Array(REPS);
 for(let r=0;r<REPS;r++){
  work.set(counts);
  for(const g of groups)for(let j=g.length-1;j>0;j--){
   const k=Math.floor(random()*(j+1)),tmp=work[g[j]];work[g[j]]=work[g[k]];work[g[k]]=tmp;
  }
  windowed[r]=delta(work,true).delta;full[r]=delta(work,false).delta;
 }
 return{seed,windowed:summarize(windowed,observed.windowed.delta),full:summarize(full,observed.full.delta)};
}
const counts=readCounts();
const observed={windowed:delta(counts,true),full:delta(counts,false)};
const globalGroups=makeGlobalGroups(),localGroups=makeWindowGroups();
const globalSizes=globalGroups.map(g=>g.length),localSizes=localGroups.map(g=>g.length);
const output={
 experiment:21,range:[START,END],blockCount:BLOCKS,primeCount:878,permutationsPerControl:REPS,
 phaseDefinition:"block starting residue modulo 210: (60001 + 10*i) mod 210",
 phaseCount:globalGroups.length,
 globalPhaseGroupSizes:{min:Math.min(...globalSizes),max:Math.max(...globalSizes),distribution:globalSizes.reduce((a,n)=>(a[n]=(a[n]||0)+1,a),{})},
 localPhaseGroupSizes:{min:Math.min(...localSizes),max:Math.max(...localSizes)},
 observed,
 results:[
  {name:"21A_global_modulo210_stratified",...run(globalGroups,counts,observed,SEEDS.global)},
  {name:"21B_within_window_modulo210_stratified",...run(localGroups,counts,observed,SEEDS.withinWindow)}
 ],
 interpretation:"The observed delta is not unusual under either modulo-210 conditional permutation control. These tests condition on observed phase-specific count distributions; they are not complete models of prime generation and do not prove independence."
};
console.log(JSON.stringify(output,null,2));
