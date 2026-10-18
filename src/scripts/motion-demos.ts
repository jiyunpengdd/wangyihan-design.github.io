/**
 * Behaviour for the motion demos. Each demo is independent: the script walks
 * every `[data-demo]` block and wires only the variant it finds, so a page can
 * carry any subset of them.
 */

const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)');

function measureTravel(root: ParentNode) {
  root.querySelectorAll<HTMLElement>('[data-travel]').forEach((el) => {
    const parent = el.parentElement;
    if (!parent) return;
    const travel = Math.max(0, parent.clientWidth - el.offsetWidth);
    el.style.setProperty('--travel', `${travel}px`);
  });
}

function watchTravel(root: HTMLElement) {
  measureTravel(root);
  const ro = new ResizeObserver(() => measureTravel(root));
  root.querySelectorAll('[data-travel]').forEach((el) => {
    if (el.parentElement) ro.observe(el.parentElement);
  });
}

function setupDuration(root: HTMLElement) {
  const range = root.querySelector<HTMLInputElement>('[data-dur-range]');
  const out = root.querySelector<HTMLOutputElement>('[data-dur-out]');
  const dot = root.querySelector<HTMLElement>('.dur-dot');
  if (!range || !dot) return;

  const apply = () => {
    const value = Number(range.value);
    dot.style.setProperty('--dur', `${value}ms`);
    if (out) out.textContent = `${value}ms`;
  };

  range.addEventListener('input', apply);
  apply();
}

function setupPress(root: HTMLElement) {
  const button = root.querySelector<HTMLElement>('[data-press]');
  if (!button) return;

  button.addEventListener('pointerdown', (event) => {
    if (prefersReduced.matches) return;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    Object.assign(ripple.style, {
      position: 'absolute',
      left: `${event.clientX - rect.left}px`,
      top: `${event.clientY - rect.top}px`,
      width: '14px',
      height: '14px',
      marginLeft: '-7px',
      marginTop: '-7px',
      borderRadius: '999px',
      background: 'currentColor',
      pointerEvents: 'none',
    } satisfies Partial<CSSStyleDeclaration>);

    button.appendChild(ripple);
    ripple
      .animate(
        [
          { scale: '0.5', opacity: 0.45 },
          { scale: '14', opacity: 0 },
        ],
        { duration: 560, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      )
      .addEventListener('finish', () => ripple.remove());
  });
}

function setupSwitches(root: HTMLElement) {
  root.querySelectorAll<HTMLButtonElement>('[data-switch]').forEach((sw) => {
    sw.addEventListener('click', () => {
      const next = sw.getAttribute('aria-checked') !== 'true';
      sw.setAttribute('aria-checked', String(next));
    });
  });
}

function setupStagger(root: HTMLElement) {
  const list = root.querySelector<HTMLElement>('[data-stagger-list]');
  const range = root.querySelector<HTMLInputElement>('[data-stagger-range]');
  const out = root.querySelector<HTMLOutputElement>('[data-stagger-out]');
  const replay = root.querySelector<HTMLElement>('[data-stagger-replay]');
  if (!list) return;

  const apply = () => {
    const value = Number(range?.value ?? 50);
    list.style.setProperty('--stagger', `${value}ms`);
    if (out) out.textContent = `${value}ms`;
  };

  const play = () => {
    list.classList.remove('is-in');
    void list.offsetWidth;
    requestAnimationFrame(() => list.classList.add('is-in'));
  };

  range?.addEventListener('input', () => {
    apply();
    play();
  });
  replay?.addEventListener('click', play);
  apply();

  const io = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        play();
        io.disconnect();
      }
    },
    { threshold: 0.4 },
  );
  io.observe(list);
}

function setupDrag(root: HTMLElement) {
  const card = root.querySelector<HTMLElement>('[data-drag-card]');
  if (!card) return;

  let startX = 0;
  let offset = 0;
  let dragging = false;
  let raf = 0;

  const settle = (from: number) => {
    cancelAnimationFrame(raf);
    let x = from;
    let v = 0;
    const step = () => {
      const dt = 1 / 60;
      const stiffness = 190;
      const damping = 21;
      v += (-stiffness * x - damping * v) * dt;
      x += v * dt;
      card.style.translate = `${x.toFixed(2)}px 0`;
      if (Math.abs(x) < 0.4 && Math.abs(v) < 0.4) {
        card.style.translate = '0px 0';
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };

  card.addEventListener('pointerdown', (event) => {
    dragging = true;
    startX = event.clientX - offset;
    card.setPointerCapture(event.pointerId);
    cancelAnimationFrame(raf);
    card.style.cursor = 'grabbing';
  });

  card.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    offset = event.clientX - startX;
    // No easing while the finger is down: the card has to sit under the finger.
    card.style.translate = `${offset}px 0`;
  });

  const end = () => {
    if (!dragging) return;
    dragging = false;
    card.style.cursor = '';
    settle(offset);
    offset = 0;
  };

  card.addEventListener('pointerup', end);
  card.addEventListener('pointercancel', end);
  card.addEventListener('lostpointercapture', end);
}

function setupMorph(root: HTMLElement) {
  const card = root.querySelector<HTMLElement>('[data-morph-card]');
  const detail = root.querySelector<HTMLElement>('[data-morph-detail]');
  const close = root.querySelector<HTMLElement>('[data-morph-close]');
  if (!card || !detail) return;

  const easing = 'cubic-bezier(0.16, 1, 0.3, 1)';

  const flip = (target: HTMLElement, from: DOMRect) => {
    const to = target.getBoundingClientRect();
    target.style.transformOrigin = 'top left';
    target.animate(
      [
        {
          transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`,
          borderRadius: '14px',
        },
        { transform: 'none', borderRadius: '18px' },
      ],
      { duration: 460, easing },
    );
  };

  card.addEventListener('click', () => {
    const from = card.getBoundingClientRect();
    card.hidden = true;
    detail.hidden = false;
    if (!prefersReduced.matches) flip(detail, from);
  });

  close?.addEventListener('click', () => {
    const from = detail.getBoundingClientRect();
    detail.hidden = true;
    card.hidden = false;
    if (!prefersReduced.matches) flip(card, from);
  });
}

function setupSkeleton(root: HTMLElement) {
  const wrap = root.querySelector<HTMLElement>('[data-skel]');
  const toggle = root.querySelector<HTMLElement>('[data-skel-toggle]');
  if (!wrap || !toggle) return;

  toggle.addEventListener('click', () => {
    wrap.classList.toggle('is-loaded');
    toggle.textContent = wrap.classList.contains('is-loaded') ? '回到加载中' : '切换状态';
  });
}

function setupReduced(root: HTMLElement) {
  const input = root.querySelector<HTMLInputElement>('[data-rm]');
  const stage = root.querySelector<HTMLElement>('[data-rm-stage]');
  const panel = root.querySelector<HTMLElement>('.rm-panel');
  const replay = root.querySelector<HTMLElement>('[data-rm-replay]');
  if (!input || !stage || !panel) return;

  const play = () => {
    panel.classList.remove('is-in');
    void panel.offsetWidth;
    requestAnimationFrame(() => panel.classList.add('is-in'));
  };

  input.addEventListener('change', () => {
    stage.classList.toggle('is-reduced', input.checked);
    play();
  });

  replay?.addEventListener('click', play);
  play();
}

export function initMotionDemos() {
  document.querySelectorAll<HTMLElement>('[data-demo]').forEach((root) => {
    const variant = root.dataset.demo;
    if (root.dataset.ready) return;
    root.dataset.ready = 'true';

    if (variant === 'duration' || variant === 'easing') watchTravel(root);
    if (variant === 'duration') setupDuration(root);
    if (variant === 'press') setupPress(root);
    if (variant === 'toggle') setupSwitches(root);
    if (variant === 'stagger') setupStagger(root);
    if (variant === 'drag') setupDrag(root);
    if (variant === 'morph') setupMorph(root);
    if (variant === 'skeleton') setupSkeleton(root);
    if (variant === 'reduced') setupReduced(root);
  });
}
