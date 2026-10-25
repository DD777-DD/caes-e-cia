(() => {
  'use strict';
  const messages = {
    geral:'Olá! Conheci a Cães & Cia pelo site e gostaria de saber mais sobre a unidade do Caji.',
    banho:'Olá! Vi o serviço de banho e tosa no site da Cães & Cia e gostaria de mais informações.',
    consultorio:'Olá! Gostaria de saber mais sobre o atendimento veterinário aos sábados.',
    produtos:'Olá! Gostaria de conhecer os produtos e acessórios disponíveis na unidade do Caji.',
    visita:'Olá! Quero visitar a Cães & Cia do Caji. Podem me informar o horário e uma referência para chegar?'
  };
  const query = new URLSearchParams(location.search);
  const attribution = Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].filter(k=>query.has(k)).map(k=>[k,(query.get(k)||'').replace(/[<>\n\r\x00-\x1F]/g,'').slice(0,100)]));
  // Mantém UTMs em memória; não cria identificadores ou armazenamento de visitantes.
  const sourceNote=[attribution.utm_source,attribution.utm_campaign].filter(Boolean).join(' / ');
  document.querySelectorAll('[data-wa]').forEach(link=>{
    const message=messages[link.dataset.wa]||messages.geral;
    link.href='https://wa.me/5571981866867?'+new URLSearchParams({text:message+(sourceNote?'\nOrigem: '+sourceNote:'')}).toString();
  });
  const cfg=window.CAES_ANALYTICS||{};
  const ga=/^G-[A-Z0-9]{5,}$/.test(cfg.ga4Id||'')?cfg.ga4Id:'';
  const pixel=/^\d{5,}$/.test(cfg.metaPixelId||'')?cfg.metaPixelId:'';
  const consentKey='caes-cia-consent-v1';
  const banner=document.getElementById('consent-banner');
  const settings=document.getElementById('privacy-settings');
  let allowed=false, initialized=false;
  function storedConsent(){try{return localStorage.getItem(consentKey);}catch{return null;}}
  function emit(name,detail={}){
    const payload={...attribution,...detail};
    document.dispatchEvent(new CustomEvent('caes:interaction',{detail:{event:name,...payload}}));
    if(!allowed)return;
    if(ga&&window.gtag)window.gtag('event',name,payload);
    // Cliques são eventos personalizados, jamais Lead, compra ou conversa confirmada.
    if(pixel&&window.fbq)window.fbq('trackCustom',name,payload);
  }
  function enable(){
    allowed=true;
    if(initialized)return;
    initialized=true;
    if(ga){
      window.dataLayer=window.dataLayer||[];
      window.gtag=function(){window.dataLayer.push(arguments);};
      window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
      window.gtag('js',new Date());
      window.gtag('config',ga,{send_page_view:false});
      const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(ga);document.head.append(script);
    }
    if(pixel){
      const fbq=function(){fbq.callMethod?fbq.callMethod.apply(fbq,arguments):fbq.queue.push(arguments);};
      fbq.queue=[];fbq.loaded=true;fbq.version='2.0';window.fbq=fbq;window._fbq=fbq;
      const script=document.createElement('script');script.async=true;script.src='https://connect.facebook.net/en_US/fbevents.js';document.head.append(script);
      fbq('init',pixel);fbq('consent','grant');fbq('track','PageView');
    }
    emit('page_view',{page_location:location.origin+location.pathname,source:attribution.utm_source||'direct_or_referral'});
  }
  if(ga||pixel){
    settings.hidden=false;
    const saved=storedConsent();
    if(saved==='granted')enable();else if(saved!=='denied')banner.hidden=false;
  }
  document.getElementById('consent-accept').addEventListener('click',()=>{
    try{localStorage.setItem(consentKey,'granted');}catch{}
    banner.hidden=true;enable();settings.focus();
  });
  document.getElementById('consent-deny').addEventListener('click',()=>{
    try{localStorage.setItem(consentKey,'denied');}catch{}
    // Recarrega após revogar para interromper bibliotecas já inicializadas.
    const reload=allowed;allowed=false;banner.hidden=true;
    if(reload)location.reload();else settings.focus();
  });
  settings.addEventListener('click',()=>{banner.hidden=false;document.getElementById('consent-deny').focus();});
  document.addEventListener('click',event=>{
    const link=event.target.closest('a');if(!link)return;
    if(link.dataset.wa)emit('whatsapp_click',{service:link.dataset.wa,placement:link.dataset.position||'unknown'});
    if(link.hasAttribute('data-route'))emit('directions_click',{placement:link.dataset.position||'unknown'});
    if(link.closest('.service'))emit('service_interaction',{service:link.dataset.wa||'unknown',interaction:'contact_click'});
  });
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const service=entry.target.querySelector('[data-wa]')?.dataset.wa;
      emit('service_view',{service});observer.unobserve(entry.target);
    }),{threshold:.5});
    document.querySelectorAll('.service').forEach(service=>observer.observe(service));
  }
  // Evento local disponível para QA mesmo com rastreadores desativados.
  if(!allowed)emit('page_view',{page_location:location.origin+location.pathname});
})();
