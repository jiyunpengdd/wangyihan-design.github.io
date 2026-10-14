export interface NavLink {
  label: string;
  href: string;
}

export const siteConfig = {
  name: 'Han',
  title: 'Han - UI&UX 设计师作品集',
  description:
    'Han 是一位常驻上海的 UI&UX 设计师，擅长将繁杂的流程与模糊的需求转化为清晰、可信赖的数字产品。这里收录了精选作品、案例研究与简历。',
  siteUrl: 'https://jiyunpengd.github.io',
  language: 'zh-CN',
  locale: 'zh_CN',
  dateLocale: 'zh-CN',
  socialImage: '/og-image.png',

  author: {
    name: 'Han',
    role: 'UI&UX 设计师',
    location: '中国上海',
    email: 'hello@example.com',
  },

  /** The pill above the homepage headline. Set `enabled: false` to remove it. */
  availability: {
    enabled: true,
    label: '2027 年 1 月起可承接新项目',
  },

  /** The button at the end of the header and in the mobile menu. */
  action: { label: '联系我', href: 'mailto:hello@example.com' },

  /** A PDF in `public/`, offered on the resume page. Leave empty to hide the button. */
  resumePdf: '',

  /** The banner and preferences dialog. Set `enabled: false` to remove both. */
  cookieConsent: {
    enabled: true,
  },

  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'Dribbble', href: 'https://dribbble.com/' },
    { label: 'Behance', href: 'https://www.behance.net/' },
    { label: 'Instagram', href: 'https://www.instagram.com/' },
  ] satisfies NavLink[],
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
