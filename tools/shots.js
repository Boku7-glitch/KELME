const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const f=process.argv[2];
for(const [w,h,n] of [[1440,860,'d'],[390,844,'m']]){const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
await p.goto('file://'+f);await p.waitForTimeout(1200);
await p.screenshot({path:`/tmp/s_${n}1.png`});
await p.screenshot({path:`/tmp/s_${n}full.png`,fullPage:true});
await p.goto('file://'+f+'#/c/sale');await p.waitForTimeout(500);await p.screenshot({path:`/tmp/s_${n}2.png`});
await p.goto('file://'+f+'#/p/55147-3');await p.waitForTimeout(600);
await p.click('.szs button:not([disabled])');await p.screenshot({path:`/tmp/s_${n}3.png`});
await p.click('#add');await p.waitForTimeout(500);await p.screenshot({path:`/tmp/s_${n}4.png`});
await p.goto('file://'+f+'#/checkout');await p.waitForTimeout(500);await p.screenshot({path:`/tmp/s_${n}5.png`});
await p.fill('#fn','ტესტ ტესტაძე');await p.fill('#fp','599 12 34 56');await p.click('#pay');await p.waitForTimeout(500);await p.screenshot({path:`/tmp/s_${n}6.png`});
console.log(n,'errors',errs);await p.close()}
await b.close()})()
