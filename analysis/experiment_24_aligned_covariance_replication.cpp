#include <algorithm>
#include <cmath>
#include <cstdint>
#include <iomanip>
#include <iostream>
#include <numeric>
#include <random>
#include <sstream>
#include <vector>
using namespace std;
const int LO=200341, HI=300511, N=HI-LO, Z=613, REPS=5000;
vector<int> primes_up_to(int n){vector<bool>s(n+1,true);s[0]=s[1]=false;for(int p=2;p*p<=n;p++)if(s[p])for(int j=p*p;j<=n;j+=p)s[j]=false;vector<int>v;for(int i=2;i<=n;i++)if(s[i])v.push_back(i);return v;}
int gcdint(int a,int b){while(b){int t=a%b;a=b;b=t;}return a;}
int main(){
 auto primes=primes_up_to(Z);double theta=1;for(int p:primes)theta*=1.0-1.0/p;
 vector<bool> isp(HI,true);isp[0]=isp[1]=false;for(int p=2;p*p<HI;p++)if(isp[p])for(int j=p*p;j<HI;j+=p)isp[j]=false;
 vector<int> primeCounts(N);int total=0,first=-1,last=-1;for(int j=0;j<N;j++){primeCounts[j]=isp[LO+j];if(primeCounts[j]){total++;if(first<0)first=LO+j;last=LO+j;}}
 if(total!=8027||first!=200341||last!=300499){cerr<<"prime validation failed\n";return 11;}
 cout<<setprecision(15)<<"{\n";
 cout<<"\"interval\":{\"start_inclusive\":"<<LO<<",\"end_exclusive\":"<<HI<<"},\n";
 cout<<"\"prime_validation\":{\"count\":"<<total<<",\"first\":"<<first<<",\"last\":"<<last<<"},\n";
 cout<<"\"cutoff\":{\"z\":"<<Z<<",\"theta\":"<<theta<<",\"theta_log_X\":"<<theta*log((double)LO)<<"},\n";
 cout<<"\"replicates_per_b\":"<<REPS<<",\n";
 vector<double> allp;vector<string> chunks;
 for(int b:{10,30,210}){
  if(N%b||(LO-1)%b){cerr<<"alignment failure\n";return 12;}
  int M=N/b,phi=0;for(int n=1;n<=b;n++)if(gcdint(n,b)==1)phi++;double Q=(double)b/phi;
  vector<int> R;for(int r=0;r<b;r++)if(gcdint(LO+r,b)==1)R.push_back(r);if((int)R.size()!=phi)return 13;
  vector<double> mu(M,0);for(int i=0;i<M;i++)for(int r:R){int n=LO+i*b+r;double q=1/(theta*log((double)n));if(!(q>0&&q<=1))return 14;mu[i]+=Q/log((double)n);}
  vector<double> sing(4*b+1,1);for(int d=1;d<(int)sing.size();d++)for(int p:primes)if(b%p)sing[d]*=1.0-((d%p==0)?1.0:2.0)/p;
  vector<double> cov[3];for(int k=1;k<=3;k++){cov[k-1].resize(M-k);for(int i=0;i<M-k;i++){double c=0;for(int r:R)for(int s:R){int n=LO+i*b+r,m=LO+(i+k)*b+s,d=m-n;if(d<=0||d>4*b-1)return 15;double joint=sing[d]/(theta*theta*log((double)n)*log((double)m));c+=joint-Q*Q/(log((double)n)*log((double)m));}cov[k-1][i]=c;}}
  vector<double> obs(M,0);for(int i=0;i<M;i++)for(int j=0;j<b;j++)obs[i]+=primeCounts[i*b+j];if((int)accumulate(obs.begin(),obs.end(),0.0)!=total)return 16;
  double K[3],Sobs[3];vector<double> sim[3];for(int k=1;k<=3;k++){double sk=0,so=0;for(int i=0;i<M-k;i++){sk+=cov[k-1][i];so+=(obs[i]-mu[i])*(obs[i+k]-mu[i+k]);}K[k-1]=sk/(M-k);Sobs[k-1]=so/(M-k);sim[k-1].reserve(REPS);}
  uint64_t seed=(b==10?2026112710ULL:(b==30?2026112730ULL:2026112810ULL));mt19937_64 rng(seed);uniform_real_distribution<double> U(0,1);
  for(int rep=0;rep<REPS;rep++){vector<unsigned char>alive(N,1);for(int j=0;j<N;j++)if(gcdint(LO+j,b)!=1)alive[j]=0;for(int p:primes)if(b%p){uniform_int_distribution<int>D(0,p-1);int a=D(rng),st=(a-LO%p+p)%p;for(int j=st;j<N;j+=p)alive[j]=0;}vector<int> counts(M,0);for(int j=0;j<N;j++)if(alive[j]){int n=LO+j;double q=1/(theta*log((double)n));if(!(q>0&&q<=1))return 17;if(U(rng)<q)counts[j/b]++;}for(int k=1;k<=3;k++){double s=0;for(int i=0;i<M-k;i++)s+=(counts[i]-mu[i])*(counts[i+k]-mu[i+k]);sim[k-1].push_back(s/(M-k));}}
  string chunk="{\"b\":"+to_string(b)+",\"blocks\":"+to_string(M)+",\"lags\":[";
  for(int k=1;k<=3;k++){auto&v=sim[k-1];double mean=accumulate(v.begin(),v.end(),0.0)/REPS,ss=0;for(double x:v)ss+=(x-mean)*(x-mean);double sd=sqrt(ss/(REPS-1)),zm=(mean-K[k-1])/(sd/sqrt((double)REPS)),zo=(Sobs[k-1]-K[k-1])/sd;int ex=0;for(double x:v)if(abs(x-K[k-1])>=abs(Sobs[k-1]-K[k-1]))ex++;double p=(1.0+ex)/(REPS+1.0);allp.push_back(p);if(k>1)chunk+=",";chunk+="{\"lag\":"+to_string(k)+",\"analytic_expected_raw_cross_product\":"+to_string(K[k-1])+",\"observed_raw_cross_product\":"+to_string(Sobs[k-1])+",\"simulation_mean_raw_cross_product\":"+to_string(mean)+",\"simulation_sd\":"+to_string(sd)+",\"simulation_mean_diagnostic_z\":"+to_string(zm)+",\"observed_z_against_exact_mean\":"+to_string(zo)+",\"two_sided_exceedances\":"+to_string(ex)+",\"marginal_p_plus_one\":"+to_string(p)+"}";}
  chunkStream<<"]}";chunks.push_back(chunkStream.str());
 }
 double minp=*min_element(allp.begin(),allp.end());cout<<"\"global_calibration\":{\"method\":\"Bonferroni on nine marginal Monte Carlo tests\",\"minimum_marginal_p\":"<<minp<<",\"adjusted_p\":"<<min(1.0,9*minp)<<",\"joint_max_p_value\":null},\n\"results\":[";for(size_t i=0;i<chunks.size();i++){if(i)cout<<",";cout<<chunks[i];}cout<<"]}\n";
}
