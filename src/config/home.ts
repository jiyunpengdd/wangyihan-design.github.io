export const hero = {
  greeting: '你好，我是 Han。',
  title: '我设计的数字产品',
  text: '十余年来，我帮助团队从真实使用场景里理解用户要什么，再把模糊需求变成清晰、可用的产品体验。无论是 PC 端、移动端，还是复杂业务系统，只要哪里让人犹豫，我就想把它理顺。',
  primary: { label: '查看精选作品', href: '/#work' },
  secondary: { label: '关于我', href: '/about/' },
  facts: [
    { value: '10+', label: '年 UI&UX 设计经验' },
    { value: '20+', label: '个已上线产品' },
  ],
};

export const work = {
  eyebrow: '精选作品',
  title: '案例研究',
  text: '几个以“清晰”为核心使命的项目：流程繁杂、风险很高，而使用者需要产品低调顺滑、不添乱。',
  /** How many featured case studies the homepage shows. */
  limit: 5,
};

export const services = {
  eyebrow: '我在做什么',
  title: '从模糊需求到产品上线',
  items: [
    {
      icon: 'lightbulb',
      title: '产品策略',
      text: '从真实使用场景中捕捉关键需求，判断什么值得先做，哪些不做。',
    },
    {
      icon: 'workflow',
      title: 'UX 与流程',
      text: '围绕用户目标做研究、旅程设计与信息架构，让复杂流程读得懂、走得通。',
    },
    {
      icon: 'layers',
      title: '设计系统',
      text: '让不断壮大的产品保持一致性的设计令牌、组件与文档。',
    },
    {
      icon: 'pen-tool',
      title: '界面打磨',
      text: '高保真 UI、原型，以及经得起工程落地考验的细节交付。',
    },
  ],
};

export const testimonials = {
  eyebrow: '客户评价',
  title: '合作团队怎么说',
  items: [
    {
      quote:
        '跟进大润发 App 从 0 到 1 亿注册用户的那几年，Han 最有价值的地方是不只看界面。需求评审里，Han 总能先追问门店、仓配和运营真正会被卡在哪里，再决定体验怎么做。',
      name: '沈其远',
      role: '康成投资（大润发）电商产品负责人',
    },
    {
      quote:
        '无人收银和门店 PDA 的使用者不是典型的互联网用户。Han 会站在收银线旁边看高峰期的真实动线，把断网、扫不上码、异常补录这些场景都提前设计进流程里，门店推广时省了很多解释成本。',
      name: '徐雯',
      role: '门店数字化改造项目经理',
    },
    {
      quote:
        '在客户端项目里，Han 交付的不只是视觉稿，还有清晰的状态说明、交互边界和组件规范。我们把 AI 工具引入设计和协作流程后，评审来回少了很多，研发还原也稳定多了。',
      name: '高岩',
      role: '西安中锐创联客户端研发负责人',
    },
  ],
};

export const closing = {
  eyebrow: '开始合作',
  title: '有值得一起打造的东西吗？\n',
  highlight: '聊聊吧。',
  text: '我每个季度只接少量 UI/UX 设计项目，从聚焦的体验审计到完整的产品改版。说说你正在做什么吧。',
};
