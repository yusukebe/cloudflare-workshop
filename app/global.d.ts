/// <reference types="vite/client" />
import {} from 'hono'

type Meta = {
  title: string
  url?: string
  imageUrl?: string
  slide?: boolean
  theme?: 'cloudflare' | 'dark' | 'light'
}

declare module 'hono' {
  interface ContextRenderer {
    (
      content: string,
      props: { frontmatter: Meta }
    ): Response | Promise<Response>
  }
}
