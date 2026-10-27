/* Cães & Cia — movimento ambiente progressivo; todos os links funcionam sem GSAP. */
(() => {
  'use strict';
  const gsap = window.gsap;
  if (!gsap) return;

  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const cleanups = [];
    const animations = new Set();
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

    const on = (element, event, callback, options) => {
      element.addEventListener(event, callback, options);
      cleanups.push(() => element.removeEventListener(event, callback, options));
    };
    const remember = animation => {
      animations.add(animation);
      return animation;
    };
    const tween = (target, vars) => {
      const animation = remember(gsap.to(target, vars));
      animation.eventCallback('onComplete', () => animations.delete(animation));
      animation.eventCallback('onInterrupt', () => animations.delete(animation));
      return animation;
    };

    // Reproduz movimentos contínuos apenas quando o elemento está próximo da tela.
    const ambient = (element, animation, margin = '12%') => {
      if (!element || !animation) return;
      remember(animation.pause());
      let visible = false;
      const sync = () => visible && !document.hidden ? animation.resume() : animation.pause();
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
          visible = entries[0].isIntersecting;
          sync();
        }, { rootMargin: `${margin} 0px`, threshold: .04 });
        observer.observe(element);
        cleanups.push(() => observer.disconnect());
      } else {
        visible = true;
      }
      on(document, 'visibilitychange', sync);
      sync();
    };

    const stage = document.querySelector('.logo-stage');
    const hero = document.querySelector('.hero-art');
    const logo = document.querySelector('.hero-logo');
    const caption = document.querySelector('.art-caption');
    if (hero && stage) {
      remember(gsap.fromTo(stage, { y: 16, scale: .97 }, {
        y: 0, scale: 1, duration: 1, ease: 'power3.out', clearProps: 'transform'
      }));

      // A marca respira e flutua sozinha; órbitas e patas mantêm a composição viva.
      const heroMotion = gsap.timeline({ repeat: -1, yoyo: true })
        .to(logo, { y: -7, rotation: 3.7, scale: 1.008, duration: 3.6, ease: 'sine.inOut' }, 0)
        .to(hero.querySelector('.paw-one'), { y: -10, x: 3, rotation: 29, duration: 2.8, ease: 'sine.inOut' }, 0)
        .to(hero.querySelector('.paw-two'), { y: 8, x: -2, rotation: -18, duration: 3.15, ease: 'sine.inOut' }, 0)
        .to(caption, { y: -6, rotation: 1.35, duration: 3.25, ease: 'sine.inOut' }, 0);
      ambient(hero, heroMotion, '18%');

      const orbitOne = hero.querySelector('.orbit-one');
      const orbitTwo = hero.querySelector('.orbit-two');
      ambient(hero, gsap.timeline({ repeat: -1 })
        .to(orbitOne, { rotation: 369, duration: 26, ease: 'none' }, 0)
        .to(orbitTwo, { rotation: -373, duration: 31, ease: 'none' }, 0), '18%');

      // Mouse continua adicionando profundidade, sem ser necessário para ver animação.
      on(hero, 'pointermove', event => {
        if (!finePointer.matches || event.pointerType === 'touch') return;
        const rect = hero.getBoundingClientRect();
        const x = Math.max(-.5, Math.min(.5, (event.clientX - rect.left) / rect.width - .5));
        const y = Math.max(-.5, Math.min(.5, (event.clientY - rect.top) / rect.height - .5));
        tween(stage, { rotationX: -y * 7, rotationY: x * 9, x: x * 6, y: y * 6, transformPerspective: 1000, duration: .55, ease: 'power3.out', overwrite: 'auto' });
      }, { passive: true });
      const resetStage = () => tween(stage, { rotationX: 0, rotationY: 0, x: 0, y: 0, scale: 1, duration: .65, ease: 'power3.out', overwrite: 'auto' });
      on(hero, 'pointerleave', resetStage);
      on(stage, 'pointerdown', () => tween(stage, { scale: .975, duration: .14, overwrite: 'auto' }));
      on(stage, 'pointerup', resetStage);
      on(stage, 'pointercancel', resetStage);
      on(stage, 'blur', resetStage);
    }

    const cards = [...document.querySelectorAll('.service, .address-card')];
    cards.forEach((card, index) => {
      const illustration = card.querySelector('.service-illustration, .big-pin');
      const arrow = card.querySelector('.service-link .icon, .address-card-bottom a .icon');
      const direction = index % 2 ? 1 : -1;

      // Cada cartão flutua em um ritmo diferente enquanto passa pela tela.
      const cardMotion = gsap.timeline({ repeat: -1, yoyo: true, delay: index * .3 })
        .fromTo(card, {
          y: direction * -6,
          rotationZ: direction * -.2
        }, {
          y: direction * 6,
          rotationZ: direction * .2,
          duration: 3.5 + index * .45,
          ease: 'sine.inOut'
        });
      ambient(card, cardMotion, '14%');

      if (illustration) {
        const iconMotion = gsap.timeline({ repeat: -1, yoyo: true, delay: .35 + index * .25 })
          .to(illustration, {
            y: -5,
            rotation: direction * 2.2,
            scale: 1.025,
            duration: 2.65 + index * .3,
            ease: 'sine.inOut'
          });
        ambient(card, iconMotion, '14%');
      }

      const rest = () => {
        card.classList.remove('is-interacting');
        if (arrow) tween(arrow, { x: 0, scale: 1, duration: .35, overwrite: 'auto' });
      };
      const lift = () => {
        card.classList.add('is-interacting');
        if (arrow) tween(arrow, { x: 4, scale: 1, duration: .35, overwrite: 'auto' });
      };
      on(card, 'pointerenter', event => { if (finePointer.matches && event.pointerType !== 'touch') lift(); });
      on(card, 'pointermove', event => {
        if (!finePointer.matches || event.pointerType === 'touch') return;
        const rect = card.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        card.style.setProperty('--pointer-x', `${x * 100}%`);
        card.style.setProperty('--pointer-y', `${y * 100}%`);
      }, { passive: true });
      on(card, 'pointerleave', rest);
      on(card, 'pointercancel', rest);
      on(card, 'pointerdown', () => arrow && tween(arrow, { x: 1, scale: .9, duration: .12, overwrite: 'auto' }));
      on(card, 'pointerup', event => finePointer.matches && event.pointerType !== 'touch' ? lift() : rest());
      on(card, 'focusin', lift);
      on(card, 'focusout', rest);
    });

    // A seção de conversa e o mapa também têm micro movimentos autônomos.
    const talkArt = document.querySelector('.talk-art');
    if (talkArt) {
      ambient(talkArt, gsap.timeline({ repeat: -1, yoyo: true })
        .to('.bubble-main', { y: -8, rotation: -7.5, duration: 3.1, ease: 'sine.inOut' }, 0)
        .to('.bubble-small', { y: 6, rotation: 8.5, duration: 2.8, ease: 'sine.inOut' }, 0)
        .to('.spark-one', { y: -7, scale: 1.14, rotation: 14, duration: 2.1, ease: 'sine.inOut' }, 0)
        .to('.spark-two', { y: 5, scale: .9, rotation: -12, duration: 2.5, ease: 'sine.inOut' }, 0), '14%');
    }
    const locationArt = document.querySelector('.location-art');
    if (locationArt) {
      ambient(locationArt, gsap.timeline({ repeat: -1, yoyo: true })
        .to('.pin-rings', { scale: 1.045, opacity: .72, duration: 3.2, ease: 'sine.inOut' }, 0)
        .to('.map-paw', { y: -6, rotation: 31, duration: 3, ease: 'sine.inOut' }, 0), '14%');
    }

    // Entrada suave durante a rolagem sem esconder o conteúdo previamente.
    if ('IntersectionObserver' in window) {
      const reveal = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          reveal.unobserve(entry.target);
          const isCard = entry.target.matches('.service, .address-card');
          const from = isCard ? { opacity: .55 } : { y: 22, opacity: .55 };
          const to = isCard
            ? { opacity: 1, duration: .75, ease: 'power3.out', clearProps: 'opacity' }
            : { y: 0, opacity: 1, duration: .75, ease: 'power3.out', clearProps: 'transform,opacity' };
          remember(gsap.fromTo(entry.target, from, to));
        });
      }, { threshold: .12 });
      document.querySelectorAll('.service, .address-card, .about-copy, .relationship-grid > div:last-child').forEach(element => reveal.observe(element));
      cleanups.push(() => reveal.disconnect());
    }

    document.querySelectorAll('.button, .whatsapp-float').forEach(button => {
      on(button, 'pointerdown', () => tween(button, { scale: .97, duration: .12, overwrite: 'auto' }));
      const reset = () => tween(button, { scale: 1, duration: .35, ease: 'power3.out', overwrite: 'auto' });
      on(button, 'pointerup', reset);
      on(button, 'pointerleave', reset);
      on(button, 'pointercancel', reset);
      on(button, 'blur', reset);
    });

    return () => {
      cleanups.forEach(cleanup => cleanup());
      animations.forEach(animation => animation.revert());
      document.querySelectorAll('.is-interacting').forEach(card => card.classList.remove('is-interacting'));
      gsap.set('.logo-stage, .hero-logo, .art-orbit, .service, .address-card, .art-caption, .paw-one, .paw-two, .service-illustration, .big-pin, .talk-bubble, .talk-spark, .pin-rings, .map-paw, .service-link .icon, .address-card-bottom a .icon, .button, .whatsapp-float', { clearProps: 'transform,opacity' });
    };
  });
})();
