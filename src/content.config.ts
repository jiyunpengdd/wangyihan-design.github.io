import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '*/index.{md,mdx}', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Overrides the `<title>` tag. Defaults to "<client> 案例研究". */
      pageTitle: z.string().optional(),
      client: z.string(),
      /** Label for the client row in the case header. */
      clientLabel: z.string().default('客户'),
      summary: z.string(),
      year: z.number().int(),
      role: z.string(),
      services: z.array(z.string()).default([]),
      duration: z.string().optional(),
      team: z.string().optional(),
      /** Omit when the cover is drawn in code (`coverMotion`). */
      cover: image().optional(),
      coverAlt: z.string().default(''),
      /** Draw the cover as a live canvas animation instead of an image. */
      coverMotion: z.boolean().default(false),
      tint: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/)
        .default('#e9e9e3'),
      order: z.number().default(100),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      url: z.url().optional(),
      /**
       * 内嵌的可操作演示。文件放 `public/` 下，走同源 http，
       * iframe 里才拿得到剪贴板这类权限（`file://` 下会静默失败）。
       */
      demo: z
        .object({
          /** 演示页地址 */
          src: z.string(),
          /** 第二个 tab 的地址，一般是设计规范 */
          spec: z.string().optional(),
          demoLabel: z.string().default('交互演示'),
          specLabel: z.string().default('设计规范'),
          /** tab 上方的一句话说明 */
          note: z.string().optional(),
        })
        .optional(),
    }),
});

export const collections = { work };
