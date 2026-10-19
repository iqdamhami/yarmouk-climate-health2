const assert=require('assert');
const clamp=(n,min=0,max=100)=>Math.min(max,Math.max(min,n));
const normalizeTemperature=t=>clamp((t-18)/22*100);
const normalizeHumidity=h=>clamp(h<=40?0:(h-40)/60*100);
const normalizePrecip=p=>clamp(Math.abs(p-50)/100*100);
const normalizeAQI=a=>clamp(a/300*100);
const normalizeHealth=h=>clamp(h/100*100);
const baseWeights={air:35,heat:25,precip:12,humidity:8,healthSens:10,other:10};
const vulnCoeff=v=>1+Math.min(Math.max(Number(v)||0,0),100)/100*0.5;
const exposureCoeff=d=>1+Math.min(Math.max(Number(d)||0,0),7)*0.035;
const capacityCoeff=c=>1-(Math.min(Math.max(Number(c)||0,0),100)/100)*0.3;
function calculate(v){
  const factors={
    air:normalizeAQI(v.aqi),
    heat:normalizeTemperature(v.temperature),
    precip:normalizePrecip(v.precip),
    humidity:normalizeHumidity(v.humidity),
    healthSens:normalizeHealth(v.health)
  };
  const other=40;
  let base=
    factors.air*baseWeights.air/100 +
    factors.heat*baseWeights.heat/100 +
    factors.precip*baseWeights.precip/100 +
    factors.humidity*baseWeights.humidity/100 +
    factors.healthSens*baseWeights.healthSens/100 +
    other*baseWeights.other/100;
  const vc=vulnCoeff(v.vulnerability);
  const ec=exposureCoeff(v.exposure);
  const cc=capacityCoeff(v.capacity);
  const adjusted=base*vc*ec*cc;
  return {score:clamp(adjusted),base:clamp(base),factors,modifiers:{vulnerability:vc,exposure:ec,capacity:cc}}
}
function classify(s){s=Number(s);if(!Number.isFinite(s))return 'low';if(s<30)return 'low';if(s<60)return 'moderate';if(s<80)return 'high';return 'critical'}
let passed=0;function test(name,fn){fn();passed++;console.log('PASS',name)}
test('clamp prevents out-of-range scores',()=>{assert.equal(clamp(-4),0);assert.equal(clamp(120),100)});
test('temperature normalization',()=>{assert.equal(normalizeTemperature(18),0);assert.equal(normalizeTemperature(40),100)});
test('AQI normalization',()=>{assert.equal(normalizeAQI(0),0);assert.equal(normalizeAQI(300),100)});
test('humidity below comfort is zero',()=>assert.equal(normalizeHumidity(40),0));
test('precip extremes produce higher risk',()=>{assert.equal(normalizePrecip(50),0);assert(normalizePrecip(0)>0)});
test('base weights sum to 100',()=>assert(Math.abs(Object.values(baseWeights).reduce((a,b)=>a+b,0)-100)<1e-9));
test('vulnerability coefficient range',()=>{assert.equal(vulnCoeff(0),1);assert.equal(vulnCoeff(100),1.5);assert(vulnCoeff(50)>1&&vulnCoeff(50)<1.5)});
test('exposure coefficient capped',()=>{assert.equal(exposureCoeff(0),1);assert(Math.abs(exposureCoeff(7)-1.245)<1e-9);assert.equal(exposureCoeff(30),exposureCoeff(7))});
test('capacity coefficient is mitigating',()=>{assert.equal(capacityCoeff(0),1);assert(Math.abs(capacityCoeff(100)-0.7)<1e-9);assert(capacityCoeff(50)>0.7&&capacityCoeff(50)<1)});
test('higher capacity lowers final score',()=>{
  const low=calculate({temperature:36,humidity:68,precip:12,aqi:145,health:42,vulnerability:38,exposure:3,capacity:20});
  const high=calculate({temperature:36,humidity:68,precip:12,aqi:145,health:42,vulnerability:38,exposure:3,capacity:90});
  assert(high.score<low.score)
});
test('higher vulnerability raises final score',()=>{
  const low=calculate({temperature:36,humidity:68,precip:12,aqi:145,health:42,vulnerability:10,exposure:3,capacity:55});
  const high=calculate({temperature:36,humidity:68,precip:12,aqi:145,health:42,vulnerability:80,exposure:3,capacity:55});
  assert(high.score>low.score)
});
test('score is bounded and deterministic',()=>{
  const v={temperature:36,humidity:68,precip:12,aqi:145,health:42,vulnerability:38,exposure:3,capacity:55};
  const a=calculate(v),b=calculate(v);
  assert.equal(a.score,b.score);assert(a.score>=0&&a.score<=100)
});
test('classification thresholds',()=>{assert.equal(classify(0),'low');assert.equal(classify(30),'moderate');assert.equal(classify(60),'high');assert.equal(classify(80),'critical')});
test('air quality has highest base weight',()=>assert(baseWeights.air>baseWeights.heat&&baseWeights.heat>baseWeights.precip));
console.log(`\n${passed} tests passed.`);
