const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('dist/app.js','utf8');
function run(config={},saved=null){
 const handlers={},events=[],scripts=[],gaEvents=[],pixelEvents=[];
 const elements={};for(const id of ['consent-banner','privacy-settings','consent-accept','consent-deny'])elements[id]={hidden:true,addEventListener(type,fn){handlers[id+':'+type]=fn;},focus(){}};
 const link={dataset:{wa:'banho',position:'service'}};
 const document={getElementById:id=>elements[id],querySelectorAll:s=>s==='[data-wa]'?[link]:[],dispatchEvent:e=>events.push(e.detail),addEventListener:(t,fn)=>handlers[t]=fn,createElement:()=>({}),head:{append:s=>scripts.push(s.src)}};
 const window={CAES_ANALYTICS:config};const ctx={window,document,location:{origin:'https://example.test',pathname:'/',search:'?utm_source=instagram&utm_campaign=caji&fbclid=not-copied',reload(){}},localStorage:{getItem:()=>saved,setItem(){}},URLSearchParams,CustomEvent:function(name,data){this.detail=data.detail;},Date};
 vm.runInNewContext(source,ctx);
 return {window,link,elements,handlers,events,scripts};
}
const off=run();assert.equal(off.scripts.length,0);assert.equal(off.elements['consent-banner'].hidden,true);assert.match(new URL(off.link.href).searchParams.get('text'),/Origem: instagram \/ caji/);assert.ok(!off.link.href.includes('not-copied'));
const invalid=run({ga4Id:'fake',metaPixelId:'fake'});assert.equal(invalid.scripts.length,0);
const ask=run({ga4Id:'G-ABCDE12345',metaPixelId:'1234567890'});assert.equal(ask.scripts.length,0);assert.equal(ask.elements['consent-banner'].hidden,false);ask.handlers['consent-accept:click']();assert.equal(ask.scripts.length,2);assert.ok(ask.window.dataLayer.some(args=>args[0]==='event'&&args[1]==='page_view'));
const refused=run({ga4Id:'G-ABCDE12345'},'denied');assert.equal(refused.scripts.length,0);assert.equal(refused.elements['consent-banner'].hidden,true);
const click={target:{closest:()=>({dataset:{wa:'banho',position:'service'},hasAttribute:()=>false,closest:()=>true})}};off.handlers.click(click);assert.ok(off.events.some(e=>e.event==='whatsapp_click'));assert.ok(!off.events.some(e=>e.event==='Lead'));assert.equal(off.scripts.length,0);
console.log('PASS: default disabled; invalid IDs disabled; consent required; accept loads two providers; decline blocks; UTMs preserved; whatsapp_click is not Lead.');
