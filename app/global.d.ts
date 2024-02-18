import {} from 'hono'

type Meta = { title: string; url?: string; imageUrl?: string }

declare module 'hono' {
  interface ContextRenderer {
    (content: string, props: { frontmatter: Meta }): Response | Promise<Response>
  }
}
