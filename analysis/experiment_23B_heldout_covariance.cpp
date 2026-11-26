#include <bits/stdc++.h>
using namespace std;
const int LO=100171, HI=200341, N=HI-LO, Z=613, REPS=5000;
vector<int> primes;
vector<int> make_primes(int n){vector<bool>s(n+1,true);s[0]=s[1]=false;for(int p=2;p*p<=n;p++)if(s[p])for(int j=p*p;j<=n;j+=p)s[j]=false;vector<int>v;for(int i=2;i<=n;i++)if(s[i])v.push_back(i);return v;}
int gcdint(int a,int b){while(b){int t=a%b;a=b;b=t;}return a;}
struct Result{int b,M; vector<double> obs[3], simMean, simSd; vector<double> sim[3];};
int main(){
 primes=make_primes(Z);
 double theta=1;for(int p:primes)theta*=1.0-1.0/p;
 vector<int> allPrimeCounts(N,0);
 vector<bool> isp(HI,true);isp[0]=isp[1]=false;for(int p=2;p*p<HI;p++)if(isp[p])for(int j=p*p;j<HI;j+=p)isp[j]=false;
 for(int j=0;j<N;j++)allPrimeCounts[j]=isp[LO+j];
 vector<Result> results;
 for(int b:{10,30,210}){
  if(N%b) {cerr<<"alignment error";return 2;}
  int M=N/b; int ph=0;for(int n=1;n<=b;n++)if(gcdint(n,b)==1)ph++; double Q=(double)b/ph;
  vector<int> R;for(int r=0;r<b;r++)if(gcdint(1+r,b)==1)R.push_back(r);
  vector<double> mu(M);
  for(int i=0;i<M;i++)for(int r:R)mu[i]+=Q/log((double)(LO+i*b+r));
  vector<double> sing(4*b+1,1.0);
  for(int d=1;d<(int)sing.size();d++)for(int p:primes)if(b%p!=0)sing[d]*=1.0-((d%p==0)?1.0:2.0)/p;
  vector<double> cov[3]; for(int k=1;k<=3;k++)cov[k-1].resize(M-k);
  for(int k=1;k<=3;k++)for(int i=0;i<M-k;i++){
    double c=0;
    for(int r:R)for(int s:R){int n=LO+i*b+r,m=LO+(i+k)*b+s,d=m-n;
      double pn=Q/log((double)n),pm=Q/log((double)m);
      double joint=sing[d]/(theta*theta*log((double)n)*log((double)m));
      c+=joint-pn*pm;
    }
    cov[k-1][i]=c;
  }
  Result res;res.b=b;res.M=M;
  vector<double> obsCounts(M);
  for(int i=0;i<M;i++)for(int j=0;j<b;j++)obsCounts[i]+=allPrimeCounts[i*b+j];
  for(int k=1;k<=3;k++){
    double T=0;for(int i=0;i<M-k;i++)T+=(obsCounts[i]-mu[i])*(obsCounts[i+k]-mu[i+k])-cov[k-1][i];
    res.obs[k-1].push_back(T/(M-k));res.sim[k-1].reserve(REPS);
  }
  mt19937_64 rng(2026112600ULL+b);
  uniform_real_distribution<double> U(0.0,1.0);
  for(int rep=0;rep<REPS;rep++){
    vector<unsigned char> alive(N,1);
    for(int j=0;j<N;j++)if(gcdint(LO+j,b)!=1)alive[j]=0;
    for(int p:primes)if(b%p!=0){uniform_int_distribution<int>D(0,p-1);int a=D(rng);int first=(a-(LO%p)+p)%p;for(int j=first;j<N;j+=p)alive[j]=0;}
    vector<int> counts(M,0);
    for(int j=0;j<N;j++)if(alive[j]){int n=LO+j;double q=1.0/(theta*log((double)n));if(U(rng)<q)counts[j/b]++;}
    for(int k=1;k<=3;k++){
      double T=0;for(int i=0;i<M-k;i++)T+=(counts[i]-mu[i])*(counts[i+k]-mu[i+k])-cov[k-1][i];
      res.sim[k-1].push_back(T/(M-k));
    }
  }
  for(int k=1;k<=3;k++){
    auto &v=res.sim[k-1];double m=accumulate(v.begin(),v.end(),0.0)/REPS;double ss=0;for(double x:v)ss+=(x-m)*(x-m);double sd=sqrt(ss/(REPS-1));res.simMean.push_back(m);res.simSd.push_back(sd);
  }
  results.push_back(move(res));cerr<<"done b="<<b<<" M="<<M<<"\n";
 }
 double obsMax=0;
 for(auto &r:results)for(int k=0;k<3;k++){double z=(r.obs[k][0]-r.simMean[k])/r.simSd[k];obsMax=max(obsMax,abs(z));}
 vector<double> maxNull(REPS,0);
 for(int rep=0;rep<REPS;rep++)for(auto &r:results)for(int k=0;k<3;k++){
  double z=(r.sim[k][rep]-r.simMean[k])/r.simSd[k];maxNull[rep]=max(maxNull[rep],abs(z));
 }
 int ge=0;for(double x:maxNull)if(x>=obsMax)ge++;
 cout<<setprecision(12)<<"{\n\"X\":"<<LO<<",\"end_exclusive\":"<<HI<<",\"z\":"<<Z<<",\"theta\":"<<theta<<",\"replicates\":"<<REPS<<",\"observed_global_max_abs_z\":"<<obsMax<<",\"global_exceedances\":"<<ge<<",\"global_p_plus_one\":"<<(1.0+ge)/(REPS+1)<<",\"results\":[\n";
 for(size_t bi=0;bi<results.size();bi++){
  auto&r=results[bi];if(bi)cout<<",\n";cout<<"{\"b\":"<<r.b<<",\"blocks\":"<<r.M<<",\"lags\":[";
  for(int k=0;k<3;k++){
   if(k)cout<<",";double obs=r.obs[k][0],m=r.simMean[k],sd=r.simSd[k],z=(obs-m)/sd;int tail=0;for(double x:r.sim[k])if(abs(x-m)>=abs(obs-m))tail++;
   cout<<"{\"lag\":"<<k+1<<",\"observed_T\":"<<obs<<",\"model_mean_T\":"<<m<<",\"model_sd_T\":"<<sd<<",\"z\":"<<z<<",\"two_sided_exceedances\":"<<tail<<",\"p_plus_one\":"<<(1.0+tail)/(REPS+1)<<"}";
  }
  cout<<"]}";
 }
 cout<<"]}\n";
}