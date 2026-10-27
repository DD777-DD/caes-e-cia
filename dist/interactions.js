/* Cães & Cia — movimento ambiente progressivo; todos os links funcionam sem GSAP. */
(() => {
  'use strict';
  const gsap = window.gsap;
  if (!gsap) return;
  const ScrollTrigger = window.ScrollTrigger;
  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

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
    cards.forEach(card => {
      const arrow = card.querySelector('.service-link .icon, .address-card-bottom a .icon');
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
    // Revelação cinematográfica: os cartões entram uma única vez, no ritmo da rolagem.
    if (ScrollTrigger) {
      const compact = window.matchMedia('(max-width: 850px)').matches;
      const prepareCard = card => {
        const children = [...card.children];
        gsap.set(card, {
          opacity: 0,
          y: compact ? 58 : 82,
          scale: compact ? .955 : .925,
          rotationX: compact ? 5 : 9,
          transformPerspective: 1200,
          filter: 'blur(9px)'
        });
        gsap.set(children, { opacity: 0, y: compact ? 14 : 22 });
        return children;
      };
      const revealCard = (timeline, card, position = 0) => {
        const children = prepareCard(card);
        timeline.to(card, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          filter: 'blur(0px)',
          duration: compact ? .92 : 1.08,
          ease: 'power4.out',
          clearProps: 'transform,filter,opacity'
        }, position).to(children, {
          opacity: 1,
          y: 0,
          duration: .68,
          stagger: .055,
          ease: 'power3.out',
          clearProps: 'transform,opacity'
        }, position + .16);
      };
      const prepareCta = cta => {
        gsap.set(cta, {
          opacity: 0,
          y: compact ? 38 : 52,
          scale: compact ? .95 : .91,
          rotationX: compact ? 5 : 9,
          transformPerspective: 1000,
          filter: 'blur(8px)'
        });
      };
      const revealCta = (timeline, cta, position = 0) => {
        prepareCta(cta);
        timeline.to(cta, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          filter: 'blur(0px)',
          duration: compact ? .9 : 1.04,
          ease: 'power4.out',
          clearProps: 'transform,filter,opacity'
        }, position);
      };
      const connectTrigger = (trigger, timeline, start = 'top 86%') => {
        remember(timeline.pause());
        const playOnceVisible = self => {
          if (self.progress > 0 && timeline.progress() < 1 && timeline.paused()) timeline.play();
        };
        const instance = ScrollTrigger.create({
          trigger,
          start,
          end: 'bottom 20%',
          invalidateOnRefresh: true,
          onEnter: () => timeline.progress() < 1 && timeline.play(),
          onLeave: () => timeline.progress() < 1 && timeline.play(),
          onUpdate: playOnceVisible
        });
        let frame = 0;
        const ensureFastScroll = () => {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => {
            if (trigger.getBoundingClientRect().top <= window.innerHeight * .9 && timeline.progress() < 1 && timeline.paused()) timeline.play();
          });
        };
        on(window, 'scroll', ensureFastScroll, { passive: true });
        on(window, 'resize', ensureFastScroll, { passive: true });
        frame = requestAnimationFrame(ensureFastScroll);
        cleanups.push(() => cancelAnimationFrame(frame));
        cleanups.push(() => instance.kill());
      };

      const serviceCards = [...document.querySelectorAll('.service')];
      if (compact) {
        serviceCards.forEach(card => {
          const timeline = gsap.timeline();
          revealCard(timeline, card);
          connectTrigger(card, timeline, 'top 88%');
        });
      } else if (serviceCards.length) {
        const timeline = gsap.timeline();
        serviceCards.forEach((card, index) => revealCard(timeline, card, index * .16));
        connectTrigger(document.querySelector('.services-grid'), timeline, 'top 82%');
      }

      const addressCard = document.querySelector('.address-card');
      if (addressCard) {
        const timeline = gsap.timeline();
        revealCard(timeline, addressCard);
        connectTrigger(addressCard, timeline, 'top 86%');
      }

      // Os CTAs acima da dobra recebem a mesma entrada em profundidade dos cartões.
      const heroActions = [...document.querySelectorAll('.hero .actions > a')];
      if (heroActions.length) {
        const timeline = gsap.timeline({ delay: .18 });
        heroActions.forEach((cta, index) => revealCta(timeline, cta, index * .1));
        remember(timeline);
      }
      const headerCta = document.querySelector('.header-cta');
      if (headerCta) {
        const timeline = gsap.timeline({ delay: .08 });
        revealCta(timeline, headerCta);
        remember(timeline);
      }
      const floatingCta = document.querySelector('.whatsapp-float');
      if (floatingCta) {
        const timeline = gsap.timeline({ delay: .62 });
        revealCta(timeline, floatingCta);
        remember(timeline);
      }

      // O restante da página segue a mesma linguagem de entrada, em escala menor.
      document.querySelectorAll('.about-grid > div, .section-top, .relationship-grid > div:last-child, .location-copy, .final-section .wrap').forEach(group => {
        const children = [...group.children];
        const ctas = children.filter(child => child.matches('.button'));
        const content = children.filter(child => !child.matches('.button'));
        gsap.set(content, { opacity: 0, y: 34, filter: 'blur(5px)' });
        const timeline = gsap.timeline();
        if (content.length) {
          timeline.to(content, {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: .9,
            stagger: .08,
            ease: 'power4.out',
            clearProps: 'transform,filter,opacity'
          });
        }
        ctas.forEach((cta, index) => revealCta(timeline, cta, .2 + index * .1));
        connectTrigger(group, timeline, 'top 87%');
      });

      const talk = document.querySelector('.talk-art');
      if (talk) {
        gsap.set(talk, { opacity: 0, y: 54, scale: .94, rotation: -2, filter: 'blur(7px)' });
        const timeline = gsap.timeline().to(talk, {
          opacity: 1, y: 0, scale: 1, rotation: 0, filter: 'blur(0px)',
          duration: 1.05, ease: 'power4.out', clearProps: 'transform,filter,opacity'
        });
        connectTrigger(talk, timeline, 'top 88%');
      }
      cleanups.push(() => ScrollTrigger.getAll().forEach(instance => instance.kill()));
    } else if ('IntersectionObserver' in window) {
      // Fallback suave caso o complemento de rolagem não carregue.
      const reveal = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          reveal.unobserve(entry.target);
          remember(gsap.fromTo(entry.target, { y: 48, opacity: 0 }, {
            y: 0, opacity: 1, duration: .95, ease: 'power4.out', clearProps: 'transform,opacity'
          }));
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
      gsap.set('.logo-stage, .hero-logo, .art-orbit, .service, .service > *, .address-card, .address-card > *, .art-caption, .paw-one, .paw-two, .service-illustration, .big-pin, .talk-art, .talk-bubble, .talk-spark, .pin-rings, .map-paw, .service-link .icon, .address-card-bottom a .icon, .button, .whatsapp-float, .about-grid > div > *, .section-top > *, .relationship-grid > div:last-child > *, .location-copy > *, .final-section .wrap > *', { clearProps: 'transform,filter,opacity,visibility' });
    };
  });
})();
