import type { ImageMetadata } from 'astro';
import adobeAftereffects from '@/assets/logos/adobe-aftereffects.svg';
import adobeIllustrator from '@/assets/logos/adobe-illustrator.svg';
import adobePhotoshop from '@/assets/logos/adobe-photoshop.svg';
import claude from '@/assets/logos/claude.svg';
import codex from '@/assets/logos/codex.png';
import coze from '@/assets/logos/coze.svg';
import cursor from '@/assets/logos/cursor.svg';
import figma from '@/assets/logos/figma.svg';
import protopie from '@/assets/logos/protopie.png';

type ResumeTool = {
  name: string;
  logo?: ImageMetadata;
  invertDark?: boolean;
  mark?: string;
};

export const resume = {
  eyebrow: '简历',
  title: '以用户需求，驱动',
  highlight: '产品体验打造。',
  text: '从消费级产品到复杂业务系统，我的工作始终从真实场景出发：找到用户卡住的地方，把复杂路径整理成清晰可用的产品。',
  snapshot: [
    { label: '求职意向', value: '高级 UI 设计师' },
    { label: '出生日期', value: '1990.12.10' },
    { label: '电话', value: '18580334702' },
    { label: '邮箱', value: '807743002@qq.com' },
  ],
  experience: [
    {
      role: '高级 UI/UX 设计师',
      company: '康成投资（中国）有限公司（大润发）',
      period: '2015.05 - 2024.06',
      text: '参与大润发 App 与门店数字化改造相关设计，覆盖 Web/PC 端、移动生鲜 App，以及无人收银和门店 PDA 等场景。',
    },
    {
      role: '高级 UI/UX 设计师',
      company: '西安中锐创联科技有限公司',
      period: '2025.10 - 至今',
      text: '负责客户端产品界面与体验设计，关注真实使用任务、状态反馈与交付细节，并通过 AI 工具提升设计执行与协作效率。',
    },
  ],
  achievements: [
    {
      title: '参与大润发两次关键转型',
      text: '从 Web/PC 端到手机生鲜 App，从线下大卖场到线上线下协同发展。跟进大润发 App 从 0 到 1 亿注册用户的迭代；通过用户反馈、运营场景和跨团队评审判断真实需求，与产品、研发及全国五大区数据运营中心协作推进体验落地。',
    },
    {
      title: '负责门店数字化改造工具设计',
      text: '参与门店无人收银系统、门店 PDA 等使用工具的研发设计，提高线上门店、仓储与全链路协作效率，节省门店人力成本，为门店数字化升级改造提供基础。',
    },
    {
      title: '利用 AI 工具提升工作效率',
      text: '在中锐创联客户端工作中，使用 AI 工具辅助设计执行与交付协作，提升整体工作效率。',
    },
  ],
  education: [{ title: '重庆工商大学', place: '影视动画', period: '' }],
  tools: [
    { name: 'Figma', logo: figma },
    { name: 'Adobe Photoshop', logo: adobePhotoshop, invertDark: true },
    { name: 'Adobe Illustrator', logo: adobeIllustrator, invertDark: true },
    { name: 'Adobe After Effects', logo: adobeAftereffects, invertDark: true },
    { name: 'ProtoPie', logo: protopie },
    { name: '手绘插画', mark: '绘' },
    { name: 'Codex', logo: codex },
    { name: 'Claude', logo: claude },
    { name: 'Cursor', logo: cursor, invertDark: true },
    { name: 'Coze', logo: coze },
  ] satisfies ResumeTool[],
};
