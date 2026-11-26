#include <algorithm>
#include <cmath>
#include <cstdint>
#include <cstdlib>
#include <iomanip>
#include <iostream>
#include <numeric>
#include <random>
#include <string>
#include <vector>
using namespace std;

const int LO=100171, HI=200341, N=HI-LO, Z=613, REPS=5000;
vector<int> make_primes(int n){
    vector<bool> s(n+1,true); s[0]=s[1]=false;
    for(int p=2;p*p<=n;p++) if(s[p]) for(int j=p*p;j<=n;j+=p) s[j]=false;
    vector<int> v; for(int i=2;i<=n;i++) if(s[i]) v.push_back(i); return v;
}
int gcdint(int a,int b){ while(b){int t=a%b;a=b;b=t;} return a; }

struct Result {
    int b=0,M=0;
    double analyticK[3]={0,0,0};
    double observedRaw[3]={0,0,0};
    double simulationMean[3]={0,0,0};
    double simulationSd[3]={0,0,0};
    double zAgainstExactMean[3]={0,0,0};
    double simulationMeanDiagnosticZ[3]={0,0,0};
    int exceedances[3]={0,0,0};
    double p[3]={0,0,0};
    vector<double> sim[3];
};

int main(){
    const vector<int> primes=make_primes(Z);
    double theta=1.0;
    for(int p:primes) theta*=1.0-1.0/p;
    if(!isfinite(theta) || theta<=0) return 10;

    vector<int> allPrimeCounts(N,0);
    vector<bool> isp(HI,true); isp[0]=isp[1]=false;
    for(int p=2;p*p<HI;p++) if(isp[p]) for(int j=p*p;j<HI;j+=p) isp[j]=false;
    int totalPrimes=0, firstPrime=-1, lastPrime=-1;
    for(int j=0;j<N;j++){
        allPrimeCounts[j]=isp[LO+j] ? 1 : 0;
        if(allPrimeCounts[j]){ totalPrimes++; if(firstPrime<0) firstPrime=LO+j; lastPrime=LO+j; }
    }
    if(totalPrimes!=8407 || firstPrime!=100183 || lastPrime!=200329){
        cerr<<"prime data validation failed: "<<totalPrimes<<" "<<firstPrime<<" "<<lastPrime<<"\n";
        return 11;
    }

    vector<Result> results;
    for(int b:{10,30,210}){
        if(N%b!=0 || (LO-1)%b!=0){ cerr<<"block alignment assertion failed for b="<<b<<"\n"; return 12; }
        const int M=N/b;
        int phi=0; for(int n=1;n<=b;n++) if(gcdint(n,b)==1) phi++;
        const double Q=(double)b/phi;
        vector<int> R;
        for(int r=0;r<b;r++) if(gcdint(LO+r,b)==1) R.push_back(r);
        if((int)R.size()!=phi){ cerr<<"active-offset assertion failed\n"; return 13; }

        vector<double> mu(M,0.0);
        for(int i=0;i<M;i++) for(int r:R){
            const int n=LO+i*b+r;
            const double q=1.0/(theta*log((double)n));
            if(!(q>0.0 && q<=1.0)){ cerr<<"thinning probability out of range at n="<<n<<"\n"; return 14; }
            mu[i]+=Q/log((double)n);
        }

        vector<double> sing(4*b+1,1.0);
        for(int d=1;d<(int)sing.size();d++)
            for(int p:primes) if(b%p!=0)
                sing[d]*=1.0-((d%p==0)?1.0:2.0)/p;

        vector<double> cov[3];
        for(int k=1;k<=3;k++) cov[k-1].resize(M-k);
        for(int k=1;k<=3;k++){
            double sumCov=0.0;
            for(int i=0;i<M-k;i++){
                double c=0.0;
                for(int r:R) for(int s:R){
                    const int n=LO+i*b+r, m=LO+(i+k)*b+s, d=m-n;
                    if(d<=0 || d>4*b-1){ cerr<<"pair difference out of range\n"; return 15; }
                    const double pn=Q/log((double)n), pm=Q/log((double)m);
                    const double joint=sing[d]/(theta*theta*log((double)n)*log((double)m));
                    c+=joint-pn*pm;
                }
                cov[k-1][i]=c;
                sumCov+=c;
            }
            // Exact expectation of the raw residual cross-product average.
            // Divide by the number of eligible adjacent block pairs.
            // (M-k) is nonzero for all tested b,k.
            // Store after the loop below.
            (void)sumCov;
        }

        Result res; res.b=b; res.M=M;
        vector<double> obsCounts(M,0.0);
        for(int i=0;i<M;i++) for(int j=0;j<b;j++) obsCounts[i]+=allPrimeCounts[i*b+j];
        const int blockTotal=(int)accumulate(obsCounts.begin(),obsCounts.end(),0.0);
        if(blockTotal!=totalPrimes){ cerr<<"block total mismatch for b="<<b<<"\n"; return 16; }

        for(int k=1;k<=3;k++){
            double sumK=0.0, sumObs=0.0;
            for(int i=0;i<M-k;i++){
                sumK+=cov[k-1][i];
                sumObs+=(obsCounts[i]-mu[i])*(obsCounts[i+k]-mu[i+k]);
            }
            res.analyticK[k-1]=sumK/(M-k);
            res.observedRaw[k-1]=sumObs/(M-k);
            res.sim[k-1].reserve(REPS);
        }

        mt19937_64 rng(2026112600ULL+(unsigned long long)b);
        uniform_real_distribution<double> U(0.0,1.0);
        for(int rep=0;rep<REPS;rep++){
            vector<unsigned char> alive(N,1);
            for(int j=0;j<N;j++) if(gcdint(LO+j,b)!=1) alive[j]=0;
            for(int p:primes) if(b%p!=0){
                uniform_int_distribution<int> D(0,p-1);
                const int a=D(rng);
                const int first=(a-(LO%p)+p)%p;
                for(int j=first;j<N;j+=p) alive[j]=0;
            }
            vector<int> counts(M,0);
            for(int j=0;j<N;j++) if(alive[j]){
                const int n=LO+j;
                const double q=1.0/(theta*log((double)n));
                if(!(q>0.0 && q<=1.0)){ cerr<<"simulated thinning probability out of range\n"; return 17; }
                if(U(rng)<q) counts[j/b]++;
            }
            for(int k=1;k<=3;k++){
                double S=0.0;
                for(int i=0;i<M-k;i++) S+=(counts[i]-mu[i])*(counts[i+k]-mu[i+k]);
                res.sim[k-1].push_back(S/(M-k));
            }
        }

        for(int k=1;k<=3;k++){
            const vector<double>& v=res.sim[k-1];
            const double mean=accumulate(v.begin(),v.end(),0.0)/REPS;
            double ss=0.0;
            for(double x:v) ss+=(x-mean)*(x-mean);
            const double sd=sqrt(ss/(REPS-1));
            if(!(sd>0.0 && isfinite(sd))) return 18;
            res.simulationMean[k-1]=mean;
            res.simulationSd[k-1]=sd;
            res.zAgainstExactMean[k-1]=(res.observedRaw[k-1]-res.analyticK[k-1])/sd;
            res.simulationMeanDiagnosticZ[k-1]=(mean-res.analyticK[k-1])/(sd/sqrt((double)REPS));
            int ge=0;
            for(double x:v) if(abs(x-res.analyticK[k-1])>=abs(res.observedRaw[k-1]-res.analyticK[k-1])) ge++;
            res.exceedances[k-1]=ge;
            res.p[k-1]=(1.0+ge)/(REPS+1.0);
        }
        results.push_back(move(res));
        cerr<<"completed b="<<b<<" M="<<M<<"\n";
    }

    double minP=1.0;
    for(const auto& r:results) for(int k=0;k<3;k++) minP=min(minP,r.p[k]);
    const double bonferroni=min(1.0,9.0*minP);

    cout<<setprecision(15);
    cout<<"{\n";
    cout<<"\"interval\":{\"start_inclusive\":"<<LO<<",\"end_exclusive\":"<<HI<<"},\n";
    cout<<"\"prime_validation\":{\"count\":"<<totalPrimes<<",\"first\":"<<firstPrime<<",\"last\":"<<lastPrime<<"},\n";
    cout<<"\"cutoff\":{\"z\":"<<Z<<",\"theta\":"<<theta<<",\"theta_log_X\":"<<theta*log((double)LO)<<"},\n";
    cout<<"\"replicates_per_b\":"<<REPS<<",\n";
    cout<<"\"global_calibration\":{\"method\":\"Bonferroni on nine marginal Monte Carlo tests\",\"minimum_marginal_p\":"<<minP<<",\"adjusted_p\":"<<bonferroni<<",\"joint_max_p_value\":null},\n";
    cout<<"\"results\":[\n";
    for(size_t bi=0;bi<results.size();bi++){
        const Result& r=results[bi]; if(bi) cout<<",\n";
        cout<<"{\"b\":"<<r.b<<",\"blocks\":"<<r.M<<",\"lags\":[";
        for(int k=0;k<3;k++){
            if(k) cout<<",";
            cout<<"{\"lag\":"<<k+1
                <<",\"analytic_expected_raw_cross_product\":"<<r.analyticK[k]
                <<",\"observed_raw_cross_product\":"<<r.observedRaw[k]
                <<",\"simulation_mean_raw_cross_product\":"<<r.simulationMean[k]
                <<",\"simulation_sd\":"<<r.simulationSd[k]
                <<",\"simulation_mean_diagnostic_z\":"<<r.simulationMeanDiagnosticZ[k]
                <<",\"observed_z_against_exact_mean\":"<<r.zAgainstExactMean[k]
                <<",\"two_sided_exceedances\":"<<r.exceedances[k]
                <<",\"marginal_p_plus_one\":"<<r.p[k]<<"}";
        }
        cout<<"]}";
    }
    cout<<"]}\n";
    return 0;
}
