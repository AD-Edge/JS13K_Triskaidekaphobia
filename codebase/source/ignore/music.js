/////////////////////////////////////////////////////
// Music Attempt god help me
/////////////////////////////////////////////////////

// 600 milliseconds - 100 BPM
let bpm = 220;
let bInterval = (60/bpm) * 1000;
let lastBeat = 0;

// Instruments
// Music 198 - 'Almost Piano'
let aP = [.6,0,123.4708,.08,.17,.16,,1.3,,,,,,.2,,.1,,.34,.04,.39,257];
let bS = [0.6,0,73.41619,.08,.2,.16,,1.4,,,,,,.2,,.1,,.1,.04,.39,257];
let bD = [3,0,55,.05,.2,.5,1,,-0.7,,,.1,,,.1,,.05,.15];


// lo hi lo hi lo hi
// zzfx(...[4,0,13,.05,.2,.25,1,1.2,-0.5,-2.8,150,,,,24,,.01,.8]); // Loaded Sound 928 bassSound 
// zzfx(...[6,0,13,.05,.2,.25,1,1.2,-0.5,-2.8,150,.03,,,24,,.01,.8]); // Loaded Sound 928 bassSound

// zzfx(...[3,0,55,.05,.2,.5,1,,-0.7,,,.1,,,.1,,.05,.15]); // Loaded Sound 929 Bass Strum hum
// zzfx(...[6.1,0,50,.05,.2,.5,1,,-0.7,,,.1,.11,,36,-5.8,.05,.15,,.26]); // Loaded Sound 929


// zzfx(...[1,0,40,0.02,0.1,0.4,2,0.8,-0.3,0,0,0.08,0,0,0,0,0.02,0.1,0]); // Loaded Sound 929


// zzfx(...[1.9,0,38,.06,.14,.31,,.3,.7,,,.08,,,19,,.02,.2,.18]); // Loaded Sound 930


// zzfx(...[1,0,880,0.01,0.15,0.2,1,0.6,0,0,0,0.02,0,0,0.05,0,0.03,0.1,0]); // Chiptune piano

// zzfx(...[2.3,0,65.40639,.01,.1,,,2.8,,,,,.36,,,,.12,,.12,.15,-1426]); // Music 935 Pulse

// Simple guitar
// zzfx(...[,,97.99886,,.05,,,,,,,,,,-2]); // Loaded Sound 937 Simple but good doof
// zzfx(...[,.4,164.8138,,.05,,,,,,,,,,18]); // Loaded Sound 937
// zzfx(...[,.4,164.8138,,.18,.15,,,,,,,,,18]); // Loaded Sound 937

// zzfx(...[,,349.2282,,.11,,,,,,,,,,,,,,.03]); // Loaded Sound 938 Simple organ

// doof snare 
// zzfx(...[,,174.6141,,.11,,1,,,-0.9,-100,,,,,,,,.03]); // Loaded Sound 938
// zzfx(...[.4,,349.2282,.04,.01,.01,4,0,16,-53,,,,,,.1,,.99,.02,.03,488]); // Loaded Sound 939 quick snare
// zzfx(...[.4,,349.2282,.04,.01,.01,4,0,16,-53,,,,,8,,,.99,.02,.03,488]); // Loaded Sound 939 crisper snare

// zzfx(...[2,,129,,.03,.008,4,1.6,67,51,,,.01,.1,1.3,,.1,.86,.04,.18]); // Random 943 snap snare

let bSc = 0;
let note1 = true;
let hi = 50;
let lo = 30;

function musicTick(timestamp) {

    const elapsed = timestamp - lastBeat;
    if(elapsed >= bInterval) {
        // playInst(aP);

        // if(note1 == true) {
        //     // console.log(hi);
        //     note1 = false;
        //     bS = modInst(bS, 2, hi);
        // } else {
        //     // console.log(lo);
        //     note1 = true;
        //     bS = modInst(bS, 2, lo);
        // }
        
        bSc++;
        if(bSc > 8) {
            // console.log("9");
            bSc = 0;
            if(hi >= 50) {
                hi = 40;
                bS = modInst(bS, 2, hi);
            } else {
                hi = 60;
                bS = modInst(bS, 2, hi);
            }
        }

        playInst(bS);

        lastBeat = timestamp;
    }

}

function modInst(inst, i, v) {
    inst[i] = v;
    return inst;
}

function playInst(inst) {
    zzfx(...inst);
}


// add to globals

//! ZzFXM (v2.0.3) | (C) Keith Clark | MIT | https://github.com/keithclark/ZzFXM
let zzfxM=(n,f,t,e=125)=>{let l,o,z,r,g,h,x,a,u,c,d,i,m,p,G,M=0,R=[],b=[],j=[],k=0,q=0,s=1,v={},w=zzfxR/e*60>>2;for(;s;k++)R=[s=a=d=m=0],t.map((e,d)=>{for(x=f[e][k]||[0,0,0],s|=!!f[e][k],G=m+(f[e][0].length-2-!a)*w,p=d==t.length-1,o=2,r=m;o<x.length+p;a=++o){for(g=x[o],u=o==x.length+p-1&&p||c!=(x[0]||0)|g|0,z=0;z<w&&a;z++>w-99&&u?i+=(i<1)/99:0)h=(1-i)*R[M++]/2||0,b[r]=(b[r]||0)-h*q+h,j[r]=(j[r++]||0)+h*q+h;g&&(i=g%1,q=x[1]||0,(g|=0)&&(R=v[[c=x[M=0]||0,g]]=v[[c,g]]||(l=[...n[c]],l[2]*=2**((g-12)/12),g>0?zzfxG(...l):[])))}m=G});return[b,j]}