import { Hono } from 'hono'
import { marked } from 'marked'
import { gfmHeadingId } from 'marked-gfm-heading-id'
import { rendererMiddleware } from './renderer'
import favicon from './favicon.ico'
import index from '../pages/index.md'
import page_20230924 from '../pages/2023-09-24.md'

marked.use(gfmHeadingId())

const app = new Hono()

app.get('*', rendererMiddleware)

app.all('/favicon.ico', (c) => {
  c.header('Content-Type', 'image/x-icon')
  return c.body(favicon)
})

app.get('/', (c) =>
  c.render(marked(index), {
    title: 'Cloudflare Workers + Hono Workshop'
  })
)
app.get('/2023-09-24', (c) =>
  c.render(marked(page_20230924), {
    title: 'Cloudflare Workers + Hono ワークショップ - ServerlessDays Tokyo 2023',
    url: 'https://workshops.yusuke.run/2023-09-24',
    imageUrl: 'https://ss.yusukebe.com/334038d5c2a675f12e962886d0a6feba9dae5717a53192e0eba5bee85247c0f2_800x592.png'
  })
)

export default app
