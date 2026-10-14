export const hero = {
  greeting: '你好，我是 Han。',
  title: '我设计的数字产品',
  text: '十余年来，我帮助团队把混乱的问题变成清晰、有用的体验。大企业、初创公司、小而精的独立团队：只要哪里有用户感到困惑，我就想去解决。',
  primary: { label: '查看精选作品', href: '/#work' },
  secondary: { label: '关于我', href: '/about/' },
  facts: [
    { value: '10+', label: '年 UI&UX 设计经验' },
    { value: '40+', label: '个已上线产品' },
    { value: '12', label: '套设计系统' },
  ],
};

export const work = {
  eyebrow: '精选作品',
  title: '案例研究',
  text: '几个以“清晰”为核心使命的项目：流程繁杂、风险很高，而使用者需要产品低调顺滑、不添乱。',
  /** How many featured case studies the homepage shows. */
  limit: 4,
};

export const services = {
  eyebrow: '我在做什么',
  title: '从模糊需求到产品上线',
  items: [
    {
      icon: 'lightbulb',
      title: '产品策略',
      text: '界定真正的问题，梳理用户需求的优先级，并决定哪些不做。',
    },
    {
      icon: 'workflow',
      title: 'UX 与流程',
      text: '为承载实际业务重量的工作流做研究、旅程设计与信息架构。',
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
        'Han 把一个用户只能忍受的控制台，变成了他们每天最先打开的产品板块。他提出了团队里没有人想到的问题。',
      name: 'Daniel Brooks',
      role: 'Nextpoint 产品负责人',
    },
    {
      quote:
        '她有一种罕见的本领，能让复杂的系统变得从容。改版上线后，我们的个案工作者再也没有要求过培训。',
      name: 'Priya Shah',
      role: 'b.combs 运营总监',
    },
    {
      quote:
        '他既是战略家，也是手艺人。每次与 Han 评审，都会让我们的界面更精简、产品更清晰。',
      name: 'Lukas Weber',
      role: 'Nestara 创始人',
    },
  ],
};

export const closing = {
  eyebrow: '开始合作',
  title: '有值得一起打造的东西吗？',
  highlight: '聊聊吧。',
  text: '我每个季度只接少量 UI/UX 设计项目，从聚焦的体验审计到完整的产品改版。说说你正在做什么吧。',
};
