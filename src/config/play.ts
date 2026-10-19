export interface PlayRound {
  /** 方块边长（px）。越往后越小，判断中心越难。 */
  size: number;
  /** 起始位置，相对棋盘的宽高比例。别太靠近正中，否则一眼就中了。 */
  start: { x: number; y: number };
}

export const PLAY_ROUNDS: PlayRound[] = [
  { size: 64, start: { x: 0.28, y: 0.32 } },
  { size: 56, start: { x: 0.68, y: 0.64 } },
  { size: 46, start: { x: 0.26, y: 0.66 } },
  { size: 38, start: { x: 0.7, y: 0.28 } },
  { size: 30, start: { x: 0.5, y: 0.18 } },
];

export const PLAY_COPY = {
  eyebrow: '小游戏',
  title: '你的眼睛',
  highlight: '准到几像素？',
  text: '把方块拖到方框正中央。松手即判，没有第二次机会。五轮之后，你会知道自己到底差几个像素。',
  footnote: '这个测试没有任何科学依据，但设计师们都玩得挺认真。',
};

/**
 * 分档切点（px）。单轮评语和总评共用同一套，
 * 免得同一个数字在两处说法打架——比如单轮 4.9 被夸「设计师的眼睛」，
 * 平均 4.9 却被判「普通人」。
 */
const CUTS = [1.5, 3.5, 6, 10, 18] as const;

/** 单轮评语，按偏差像素数分档。 */
export function roundVerdict(px: number): string {
  if (px < CUTS[0]) return '你是不是偷偷开了网格。';
  if (px < CUTS[1]) return '像素眼，参考线可以关了。';
  if (px < CUTS[2]) return '这就是设计师的眼睛。';
  if (px < CUTS[3]) return '正常人类，别慌。';
  if (px < CUTS[4]) return '建议把参考线打开。';
  return '自动对齐这个功能，了解一下。';
}

/** 五轮平均分的总评。 */
export function finalVerdict(avg: number): { label: string; note: string } {
  if (avg < CUTS[0]) return { label: '像素眼', note: '你大概能一眼看出 1px 的错位。' };
  if (avg < CUTS[1]) return { label: '设计师级', note: '日常的对齐和间距判断，都靠得住。' };
  if (avg < CUTS[2]) return { label: '手很稳', note: '这个准头，画视觉稿够用了。' };
  if (avg < CUTS[3]) return { label: '普通人', note: '大多数人对中心的判断就落在这个区间。' };
  if (avg < CUTS[4]) return { label: '参考线依赖', note: '关掉参考线之后，你大概会开始不放心。' };
  return { label: '交给自动对齐', note: '没关系，Figma 和 Sketch 都有对齐功能。' };
}
