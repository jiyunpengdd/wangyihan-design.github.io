export interface NavLink {
  label: string;
  href: string;
}

export const siteConfig = {
  name: 'Han',
  title: 'Han - 高级 UI/UX 设计师作品集',
  description:
    'Han 是一位常驻上海的高级 UI/UX 设计师，关注用户思维、服务体验与数字化工具。这里收录了精选作品、案例研究与简历。',
  siteUrl: 'https://wangyihan-design.github.io',
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

  /** The banner and preferences dialog. Set `enabled: false` to remove both. */
  cookieConsent: {
    enabled: true,
  },

  socials: [{ label: 'GitHub', href: 'https://github.com/byunghun-jake' }] satisfies NavLink[],
};

export const navigation: NavLink[] = [
  { label: '作品', href: '/work/' },
  { label: '关于', href: '/about/' },
  { label: '简历', href: '/resume/' },
];

export const legalLinks: NavLink[] = [
  { label: '隐私政策', href: '/privacy/' },
  { label: '使用条款', href: '/terms/' },
  { label: 'Cookie 政策', href: '/cookies/' },
];
