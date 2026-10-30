export interface NavLink {
  label: string;
  href: string;
}

export const siteConfig = {
  name: 'Han',
  title: 'Han - 高级 UI/UX 设计师作品集',
  description:
    'Han 是一位常驻上海的高级 UI/UX 设计师，关注用户需求洞察、跨端产品体验与 AI 辅助设计。这里收录了精选作品、案例研究与简历。',
  siteUrl: 'https://han-design.top',
  language: 'zh-CN',
  locale: 'zh_CN',
  dateLocale: 'zh-CN',
  socialImage: '/og-image.jpg',

  author: {
    name: 'Han',
    role: '高级 UI/UX 设计师',
    location: '中国上海',
    email: '807743002@qq.com',
    phone: '18580334702',
  },

  /** The pill above the homepage headline. Set `enabled: false` to remove it. */
  availability: {
    enabled: true,
    label: 'Base上海·随时到岗',
  },

  /** The button at the end of the header and in the mobile menu. */
  action: { label: '联系我', href: 'mailto:807743002@qq.com' },

  /** A PDF in `public/`, offered on the resume page. Leave empty to hide the button. */
  resumePdf: '',

  /**
   * ICP 备案号，按《互联网信息服务管理办法》要求公示在页面底部，并链接到工信部备案系统。
   * 留空则不显示。公安联网备案通过后，可另起一行用 `publicSecurity`。
   */
  icp: {
    number: '沪ICP备2026057358号',
    href: 'https://beian.miit.gov.cn/',
  },

  /** 公安联网备案号，例如「沪公网安备 31010402001234号」。留空则不显示。 */
  publicSecurity: {
    number: '',
    href: 'https://beian.mps.gov.cn/',
  },

  /** The banner and preferences dialog. Set `enabled: false` to remove both. */
  cookieConsent: {
    enabled: true,
  },

  socials: [{ label: 'GitHub', href: 'https://github.com/wangyihan-design' }] satisfies NavLink[],
};

export const navigation: NavLink[] = [
  { label: '作品', href: '/work/' },
  { label: '关于', href: '/about/' },
  { label: '简历', href: '/resume/' },
  { label: '小游戏', href: '/play/' },
];

export const legalLinks: NavLink[] = [
  { label: '隐私政策', href: '/privacy/' },
  { label: '使用条款', href: '/terms/' },
  { label: 'Cookie 政策', href: '/cookies/' },
];
