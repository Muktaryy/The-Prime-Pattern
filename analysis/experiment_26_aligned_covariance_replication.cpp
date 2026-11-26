#include <algorithm>
#include <cmath>
#include <cstdint>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <numeric>
#include <random>
#include <vector>
using namespace std;
static const int LO=720511, HI=2820511, N=HI-LO, B=210, Z=613, REPS=5000, M=N/B, LAG=3;
vector<int> primes_up_to(int n){vector<bool>s(n+1,true);s[0]=s[1]=false;for(int p=2;p*p<=n;p++)if(s[p])for(int j=p*p;j<=n;j+=p)s[j]=false;vector<int>v;for(int i=2;i<=n;i++)if(s[i])v.push_back(i);return v;}
int gcdint(int a,int b){while(b){int t=b;a=b;b=t%b;}return a;}
int main(){
 if(N!=2100000 || N%B || (LO-1)%B)return 2;
 auto small=primes_up_to(Z);double theta=1;for(int p:small)theta*=1.0-1.0/p;
 vector<int>R;for(int r=0;r<B;r++)if(gcdint(LO+r,B)==1)R.push_back(r);if(R.size()!=48)return 3;
 vector<unsigned char>eligible(N);for(int j=0;j<N;j++)eligible[j]=(gcdint(LO+j,B)==1);
 vector<double>mu(M);for(int i=0;i<M;i++)for(int r:R){int n=LO+i*B+r;double q=1/(theta*log((double)n));if(!(q>0&&q<=1))return 4;mu[i]+=((double)B/48)/log((double)n);}
 vector<double>sing(4*B,1);for(int d=1;d<(int)sing.size();d++)for(int p:small)if(B%p)sing[d]*=1-((d%p==0)?1.0:2.0)/p;
 vector<double>blockcov(M-LAG);double K=0;
 for(int i=0;i<M-LAG;i++){double c=0;for(int r:R)for(int s:R){int n=LO+i*B+r,m=LO+(i+LAG)*B+s,d=m-n;if(d<=0||d>4*B-1)return 5;c+=sing[d]/(theta*theta*log((double)n)*log((double)m))-pow((double)B/48,2)/(log((double)n)*log((double)m));}blockcov[i]=c;K+=c;}K/=M-LAG;
 vector<unsigned char>isp(HI,1);isp[0]=isp[1]=0;for(int p=2;p*p<HI;p++)if(isp[p])for(int j=p*p;j<HI;j+=p)isp[j]=0;
 vector<int>counts(M),primeList;int total=0,first=-1,last=-1;for(int j=0;j<N;j++)if(isp[LO+j]){int n=LO+j;counts[j/B]++;primeList.push_back(n);total++;if(first<0)first=n;last=n;}
 if(total!=146713||first!=720527||last!=2820509)return 6;
 vector<double>e(M);for(int i=0;i<M;i++)e[i]=counts[i]-mu[i];double S=0;for(int i=0;i<M-LAG;i++)S+=e[i]*e[i+LAG];S/=M-LAG;
 mt19937_64 rng(20261129210ULL);uniform_real_distribution<double>U(0,1);vector<double>sims;sims.reserve(REPS);vector<unsigned char>alive(N);
 for(int rep=0;rep<REPS;rep++){alive=eligible;for(int p:small)if(B%p){uniform_int_distribution<int>D(0,p-1);int a=D(rng),st=(a-LO%p+p)%p;for(int j=st;j<N;j+=p)alive[j]=0;}vector<int>sc(M);for(int j=0;j<N;j++)if(alive[j]){int n=LO+j;double q=1/(theta*log((double)n));if(U(rng)<q)sc[j/B]++;}double v=0;for(int i=0;i<M-LAG;i++)v+=(sc[i]-mu[i])*(sc[i+LAG]-mu[i+LAG]);sims.push_back(v/(M-LAG));}
 double mean=accumulate(sims.begin(),sims.end(),0.0)/REPS,ss=0;for(double x:sims)ss+=(x-mean)*(x-mean);double sd=sqrt(ss/(REPS-1)),mcse=sd/sqrt((double)REPS),zo=(S-K)/sd;int ex=0;for(double x:sims)if(abs(x-K)>=abs(S-K))ex++;double pval=(1.0+ex)/(REPS+1.0);
 ofstream out("results/experiment_26_raw.json");out<<setprecision(17)<<"{\n\"interval\":["<<LO<<","<<HI<<"],\n\"prime_count\":"<<total<<",\n\"first_prime\":"<<first<<",\n\"last_prime\":"<<last<<",\n\"theta\":"<<theta<<",\n\"K\":"<<K<<",\n\"S\":"<<S<<",\n\"sim_mean\":"<<mean<<",\n\"sim_sd\":"<<sd<<",\n\"sim_mcse\":"<<mcse<<",\n\"observed_z\":"<<zo<<",\n\"exceedances\":"<<ex<<",\n\"p_plus_one\":"<<pval<<"}\n";
 ofstream co("data/prime_counts_720511_2820510_by_210.csv");co<<"block_index,block_start,prime_count,model_mean,residual\n";for(int i=0;i<M;i++)co<<i<<","<<LO+i*B<<","<<counts[i]<<","<<setprecision(12)<<mu[i]<<","<<e[i]<<"\n";
 ofstream po("data/primes_720511_2820510.txt");for(int n:primeList)po<<n<<"\n";
 ofstream so("results/experiment_26_simulation_draws.csv");so<<"replicate,statistic\n";for(int i=0;i<REPS;i++)so<<i+1<<","<<setprecision(17)<<sims[i]<<"\n";
 ofstream dg("results/experiment_26_diagnostics.csv");dg<<"section,pairs,mean_observed_product,mean_model_covariance,mean_excess,mean_residual_current,mean_residual_lag3\n";
 vector<double>excess(M-LAG);for(int i=0;i<M-LAG;i++)excess[i]=e[i]*e[i+LAG]-blockcov[i];
 for(int q=0;q<4;q++){int st=q*(M-LAG)/4,en=(q+1)*(M-LAG)/4;double a=0,b=0,c=0,d=0,f=0;for(int i=st;i<en;i++){a+=e[i]*e[i+LAG];b+=blockcov[i];c+=e[i];d+=e[i+LAG];f+=excess[i];}int len=en-st;dg<<q+1<<","<<len<<","<<a/len<<","<<b/len<<","<<f/len<<","<<c/len<<","<<d/len<<"\n";}
 cerr<<setprecision(12)<<"count="<<total<<" S="<<S<<" K="<<K<<" sim_mean="<<mean<<" sd="<<sd<<" z="<<zo<<" exceed="<<ex<<" p="<<pval<<"\n";
}