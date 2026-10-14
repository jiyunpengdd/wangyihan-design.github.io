import figma from '@/assets/logos/figma.svg';
import framer from '@/assets/logos/framer.svg';
import shopify from '@/assets/logos/shopify.svg';
import webflow from '@/assets/logos/webflow.svg';

export const resume = {
  eyebrow: '简历',
  title: '10+ 年，通过 UX、UI 与系统思维',
  highlight: '塑造数字产品。',
  text: '我的工作核心是体验的清晰度：为混乱的流程、过载的界面，以及需要在扩展中保持易用性的成长型系统建立结构。',
  snapshot: [
    { label: '所在地', value: '中国上海' },
    { label: '专注方向', value: 'UI&UX 设计' },
    { label: '专长', value: '控制台、工作流、设计系统' },
    { label: '语言', value: '中文、英语' },
  ],
  experience: [
    {
      role: '资深 UI/UX 设计师',
      company: '独立执业',
      period: '2021 至今',
      text: '为法律、公益与地产行业的 SaaS 和服务平台负责界面设计、产品策略与设计系统。',
    },
    {
      role: '资深 UI/UX 设计师',
      company: 'Northbound Studio',
      period: '2017 - 2021',
      text: '为初创与企业客户设计工作流、控制台和多平台产品，并搭建了工作室的共享组件库。',
    },
    {
      role: 'UI/UX Designer',
      company: '企业内部产品团队',
      period: '2014 - 2017',
      text: '为 Web 和移动产品构建核心界面模式、用户流程和可投入生产的视觉系统。',
    },
  ],
  capabilities: [
    {
      title: '产品策略',
      text: '界定问题、排定体验决策的优先级，让产品目标与用户价值保持一致。',
    },
    {
      title: 'UI 系统',
      text: '能够在流程、功能和实施团队之间规模化延展的界面语言。',
    },
    {
      title: '落地执行',
      text: '从线框图到高保真 UI，持续打磨，直至达到可交付开发的标准。',
    },
  ],
  education: [
    { title: '交互设计硕士', place: 'University of the Arts', period: '2014' },
    { title: '视觉传达学士', place: 'National University of Arts', period: '2012' },
  ],
  tools: [
    { name: 'Figma', logo: figma, dark: false },
    { name: 'Framer', logo: framer, dark: true },
    { name: 'Webflow', logo: webflow, dark: false },
    { name: 'Shopify', logo: shopify, dark: false },
  ],
};
