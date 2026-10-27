/* Cães & Cia — movimentos progressivos; todos os links funcionam sem GSAP. */
(() => {
  'use strict';
  const gsap = window.gsap;
  if (!gsap) return;
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', context => {
    const cleanups = [];
    const animations = new Set();
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const on = (element, event, callback, options) => {
      element.addEventListener(event, callback, options);
      cleanups.push(() => element.removeEventListener(event, callback, options));
    };
    const tween = (target, vars) => {
      const animation = gsap.to(target, vars);
      animations.add(animation);
      animation.eventCallback('onComplete', () => animations.delete(animation));
      animation.eventCallback('onInterrupt', () => animations.delete(animation));
      return animation;
    };
    const stage = document.querySelector('.logo-stage');
    const hero = document.querySelector('.hero-art');
    const caption = document.querySelector('.art-caption');
    if (hero && stage) {
      const intro = gsap.fromTo(stage, { y: 16, scale: .97 }, { y: 0, scale: 1, duration: 1, ease: 'power3.out', clearProps: 'transform' });
      animations.add(intro);
      // O movimento ambiente pausa fora da tela ou quando a aba está oculta.
      const float = gsap.timeline({ repeat: -1, yoyo: true, paused: true })
        .to(hero.querySelector('.paw-one'), { y: -9, rotation: 28, duration: 2.8, ease: 'sine.inOut' }, 0)
        .to(hero.querySelector('.paw-two'), { y: 8, rotation: -17, duration: 3.1, ease: 'sine.inOut' }, 0)
        .to(caption, { y: -5, rotation: 1.5, duration: 3.2, ease: 'sine.inOut' }, 0);
      animations.add(float);
      let visible = true;
      const sync = () => visible && !document.hidden ? float.resume() : float.pause();
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); });
        observer.observe(hero); cleanups.push(() => observer.disconnect());
      }
      on(document, 'visibilitychange', sync);sync();
      on(hero, 'pointermove', event => {
        if (!finePointer.matches || event.pointerType === 'touch') return;
        const rect = hero.getBoundingClientRect();
        const x = Math.max(-.5, Math.min(.5, (event.clientX - rect.left) / rect.width - .5));
        const y = Math.max(-.5, Math.min(.5, (event.clientY - rect.top) / rect.height - .5));
        tween(stage, { rotationX: -y * 7, rotationY: x * 9, x: x * 6, y: y * 6, transformPerspective: 1000, duration: .55, ease: 'power3.out', overwrite: 'auto' });
      }, { passive: true });
      const reset = () => tween(stage, { rotationX: 0, rotationY: 0, x: 0, y: 0, scale: 1, duration: .65, ease: 'power3.out', overwrite: 'auto' });
      on(hero, 'pointerleave', reset);
      on(stage, 'pointerdown', () => tween(stage, { scale: .975, duration: .14, overwrite: 'auto' }));
      on(stage, 'pointerup', reset);on(stage, 'pointercancel', reset);on(stage, 'blur', reset);
    }
    const cards = [...document.querySelectorAll('.service, .address-card')];
    cards.forEach(card => {
      const illustration = card.querySelector('.service-illustration, .big-pin');
      const arrow = card.querySelector('.service-link .icon, .address-card-bottom a .icon');
      const rest = () => {
        card.classList.remove('is-interacting');
        tween(card, { y: 0, scale: 1, rotationX: 0, rotationY: 0, duration: .5, ease: 'power3.out', overwrite: 'auto' });
        if (illustration) tween(illustration, { y: 0, rotation: 0, scale: 1, duration: .5, ease: 'power3.out', overwrite: 'auto' });
        if (arrow) tween(arrow, { x: 0, duration: .35, overwrite: 'auto' });
      };
      const lift = () => {
        card.classList.add('is-interacting');
        tween(card, { y: -7, scale: 1, duration: .4, ease: 'power3.out', overwrite: 'auto' });
        if (illustration) tween(illustration, { y: -5, rotation: -5, scale: 1.055, duration: .5, ease: 'back.out(1.5)', overwrite: 'auto' });
        if (arrow) tween(arrow, { x: 4, duration: .35, overwrite: 'auto' });
      };
      on(card, 'pointerenter', event => { if (finePointer.matches && event.pointerType !== 'touch') lift(); });
      on(card, 'pointermove', event => {
        if (!finePointer.matches || event.pointerType === 'touch') return;
        const rect = card.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        card.style.setProperty('--pointer-x', `${x * 100}%`);
        card.style.setProperty('--pointer-y', `${y * 100}%`);
        tween(card, { rotationX: (.5 - y) * 3, rotationY: (x - .5) * 4, transformPerspective: 1100, duration: .5, ease: 'power3.out', overwrite: 'auto' });
      }, { passive: true });
      on(card, 'pointerleave', rest);on(card, 'pointercancel', rest);
      on(card, 'pointerdown', () => tween(card, { scale: .985, duration: .12, overwrite: 'auto' }));
      on(card, 'pointerup', event => finePointer.matches && event.pointerType !== 'touch' ? lift() : rest());
      on(card, 'focusin', lift);on(card, 'focusout', rest);
    });
    // Revela somente quando o componente chega à tela, sem esconder conteúdo previamente.
    if ('IntersectionObserver' in window) {
      const reveal = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          reveal.unobserve(entry.target);
          animations.add(gsap.fromTo(entry.target, { y: 22, opacity: .55 }, { y: 0, opacity: 1, duration: .75, ease: 'power3.out', clearProps: 'transform,opacity' }));
        });
      }, { threshold: .12 });
      document.querySelectorAll('.service, .address-card, .about-copy, .relationship-grid > div:last-child').forEach(card => reveal.observe(card));
      cleanups.push(() => reveal.disconnect());
    }
    // Microfeedback discreto nas demais chamadas, inclusive no botão de WhatsApp.
    document.querySelectorAll('.button, .whatsapp-float').forEach(button => {
      on(button, 'pointerdown', () => tween(button, { scale: .97, duration: .12, overwrite: 'auto' }));
      const reset = () => tween(button, { scale: 1, duration: .35, ease: 'power3.out', overwrite: 'auto' });
      on(button, 'pointerup', reset);on(button, 'pointerleave', reset);on(button, 'pointercancel', reset);on(button, 'blur', reset);
    });
    return () => {
      cleanups.forEach(cleanup => cleanup());
      animations.forEach(animation => animation.revert());
      document.querySelectorAll('.is-interacting').forEach(card => card.classList.remove('is-interacting'));
      gsap.set('.logo-stage, .service, .address-card, .art-caption, .paw-one, .paw-two, .service-illustration, .big-pin, .service-link .icon, .address-card-bottom a .icon, .button, .whatsapp-float', { clearProps: 'transform' });
    };
  });
})();
