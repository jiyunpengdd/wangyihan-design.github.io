import { PLAY_ROUNDS, finalVerdict, roundVerdict } from '@/config/play';

const BEST_KEY = 'han-pixel-eye-best';

interface Point {
  x: number;
  y: number;
}

interface Drag {
  px: number;
  py: number;
  ox: number;
  oy: number;
  moved: boolean;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

function readBest(): number | null {
  try {
    const raw = window.localStorage.getItem(BEST_KEY);
    if (!raw) return null;
    const value = Number.parseFloat(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

function writeBest(value: number) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    /* 隐私模式写不进去，本局照常算分 */
  }
}

/**
 * 像素眼：把方块拖到棋盘正中，松手立刻判偏差。
 *
 * 一锤定音是这个游戏的关键——允许反复微调就没有「眼力」可言了，
 * 所以 pointerup 直接结算，方向键也只给 2px 步进。
 */
function setup(root: HTMLElement) {
  const pick = <T extends Element>(selector: string) => root.querySelector<T>(selector);

  const board = pick<HTMLElement>('[data-board]');
  const tile = pick<HTMLElement>('[data-tile]');
  const target = pick<HTMLElement>('[data-target]');
  const svg = pick<SVGSVGElement>('[data-measure]');
  const line = pick<SVGLineElement>('[data-measure-line]');
  const dot = pick<SVGCircleElement>('[data-measure-dot]');
  const hint = pick<HTMLElement>('[data-hint]');
  const result = pick<HTMLElement>('[data-result]');
  const resultValue = pick<HTMLElement>('[data-result-value]');
  const resultNote = pick<HTMLElement>('[data-result-note]');
  const nextButton = pick<HTMLButtonElement>('[data-next]');
  const roundLabel = pick<HTMLElement>('[data-round]');
  const dotList = pick<HTMLElement>('[data-dots]');
  const summary = pick<HTMLElement>('[data-summary]');
  const finalValue = pick<HTMLElement>('[data-final-value]');
  const finalRank = pick<HTMLElement>('[data-final-rank]');
  const finalNote = pick<HTMLElement>('[data-final-note]');
  const restartButton = pick<HTMLButtonElement>('[data-restart]');
  const bestLabel = pick<HTMLElement>('[data-best]');

  if (!board || !tile || !target || !svg || !line || !dot || !nextButton) return;

  const dots = dotList ? [...dotList.children] : [];
  const total = PLAY_ROUNDS.length;

  let round = 0;
  let errors: number[] = [];
  let position: Point = { x: 0, y: 0 };
  let drag: Drag | null = null;
  let judged = false;
  let finished = false;

  const boardSize = () => ({ w: board.clientWidth, h: board.clientHeight });
  const tileSize = () => tile.offsetWidth;
  const maxX = () => Math.max(0, boardSize().w - tileSize());
  const maxY = () => Math.max(0, boardSize().h - tileSize());

  const paint = () => {
    tile.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
  };

  const showBest = (value: number | null) => {
    if (!bestLabel) return;
    if (value === null) {
      bestLabel.hidden = true;
      return;
    }
    bestLabel.hidden = false;
    bestLabel.textContent = `最好成绩 ${value.toFixed(1)}px`;
  };

  const placeRound = (index: number) => {
    const config = PLAY_ROUNDS[index];
    board.style.setProperty('--tile-size', `${config.size}px`);

    const { w, h } = boardSize();
    position = {
      x: clamp(Math.round(config.start.x * w - config.size / 2), 0, maxX()),
      y: clamp(Math.round(config.start.y * h - config.size / 2), 0, maxY()),
    };

    judged = false;
    drag = null;
    board.dataset.state = 'idle';
    delete tile.dataset.dragging;
    paint();

    if (hint) hint.hidden = false;
    if (result) result.hidden = true;
    nextButton.hidden = true;
    if (roundLabel) roundLabel.textContent = String(index + 1);
  };

  const judge = () => {
    if (judged || finished) return;
    judged = true;
    board.dataset.state = 'judged';

    const size = tileSize();
    const { w, h } = boardSize();
    const centerX = w / 2;
    const centerY = h / 2;
    const tileX = position.x + size / 2;
    const tileY = position.y + size / 2;
    const distance = Math.hypot(tileX - centerX, tileY - centerY);

    errors.push(distance);

    target.style.transform = `translate3d(${centerX - size / 2}px, ${centerY - size / 2}px, 0)`;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    line.setAttribute('x1', String(tileX));
    line.setAttribute('y1', String(tileY));
    line.setAttribute('x2', String(centerX));
    line.setAttribute('y2', String(centerY));
    dot.setAttribute('cx', String(centerX));
    dot.setAttribute('cy', String(centerY));

    if (resultValue) resultValue.textContent = distance.toFixed(1);
    if (resultNote) resultNote.textContent = roundVerdict(distance);
    if (hint) hint.hidden = true;
    if (result) result.hidden = false;

    dots[round]?.setAttribute('data-done', '');
    nextButton.textContent = round + 1 >= total ? '看成绩' : '下一轮';
    nextButton.hidden = false;
    nextButton.focus({ preventScroll: true });
  };

  const finish = () => {
    finished = true;
    const average = errors.reduce((sum, value) => sum + value, 0) / Math.max(errors.length, 1);
    const verdict = finalVerdict(average);

    if (finalValue) finalValue.textContent = average.toFixed(1);
    if (finalRank) finalRank.textContent = verdict.label;
    if (finalNote) finalNote.textContent = verdict.note;

    if (summary) summary.hidden = false;
    if (result) result.hidden = true;
    if (hint) hint.hidden = true;
    nextButton.hidden = true;

    const best = readBest();
    if (best === null || average < best) {
      writeBest(average);
      showBest(average);
    } else {
      showBest(best);
    }

    restartButton?.focus({ preventScroll: true });
  };

  const next = () => {
    if (!judged) return;

    if (round + 1 >= total) {
      finish();
      return;
    }

    round += 1;
    placeRound(round);
    tile.focus({ preventScroll: true });
  };

  const restart = () => {
    round = 0;
    errors = [];
    finished = false;
    if (summary) summary.hidden = true;
    dots.forEach((item) => item.removeAttribute('data-done'));
    placeRound(0);
    tile.focus({ preventScroll: true });
  };

  tile.addEventListener('pointerdown', (event) => {
    if (judged || finished || event.button !== 0) return;

    drag = { px: event.clientX, py: event.clientY, ox: position.x, oy: position.y, moved: false };

    try {
      tile.setPointerCapture(event.pointerId);
    } catch {
      /* 合成事件拿不到指针捕获，拖拽照样能用 */
    }

    tile.dataset.dragging = '';
    event.preventDefault();
  });

  tile.addEventListener('pointermove', (event) => {
    if (!drag) return;

    const dx = event.clientX - drag.px;
    const dy = event.clientY - drag.py;

    if (!drag.moved) {
      if (Math.hypot(dx, dy) < 2) return;
      drag.moved = true;
    }

    position.x = clamp(drag.ox + dx, 0, maxX());
    position.y = clamp(drag.oy + dy, 0, maxY());
    paint();
  });

  const endDrag = (settle: boolean) => {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    delete tile.dataset.dragging;
    if (settle && moved) judge();
  };

  tile.addEventListener('pointerup', () => endDrag(true));
  tile.addEventListener('pointercancel', () => endDrag(false));

  tile.addEventListener('keydown', (event) => {
    if (judged || finished) return;

    const step = event.shiftKey ? 10 : 2;
    let handled = true;

    switch (event.key) {
      case 'ArrowLeft':
        position.x = clamp(position.x - step, 0, maxX());
        break;
      case 'ArrowRight':
        position.x = clamp(position.x + step, 0, maxX());
        break;
      case 'ArrowUp':
        position.y = clamp(position.y - step, 0, maxY());
        break;
      case 'ArrowDown':
        position.y = clamp(position.y + step, 0, maxY());
        break;
      case 'Enter':
      case ' ':
        judge();
        break;
      default:
        handled = false;
    }

    if (handled) {
      event.preventDefault();
      paint();
    }
  });

  nextButton.addEventListener('click', next);
  restartButton?.addEventListener('click', restart);

  // 窗口变了就把方块收回边界内；已经判过的那一轮不重算，免得图上的线错位
  let resizeFrame = 0;
  window.addEventListener('resize', () => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(() => {
      if (judged || finished) return;
      position.x = clamp(position.x, 0, maxX());
      position.y = clamp(position.y, 0, maxY());
      paint();
    });
  });

  showBest(readBest());
  placeRound(0);
}

export function initPixelEye() {
  document.querySelectorAll<HTMLElement>('[data-game]').forEach((root) => {
    if (root.dataset.ready === '1') return;
    root.dataset.ready = '1';
    setup(root);
  });
}
