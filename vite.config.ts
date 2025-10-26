import ssg from '@hono/vite-ssg'
import mdx from '@mdx-js/rollup'
import honox from 'honox/vite'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import rehypeSlug from 'rehype-slug'
import { defineConfig } from 'vite'

const entry = './app/server.ts'

export default defineConfig(() => {
  return {
    plugins: [
      honox({
        devServer: {
          handleHotUpdate: ({ server }) => {
            server.hot.send({ type: 'full-reload' })
            return []
          }
        }
      }),
      ssg({ entry }),
      mdx({
        jsxImportSource: 'hono/jsx',
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
        rehypePlugins: [rehypeSlug]
      })
    ]
  }
})
