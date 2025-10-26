import { createMiddleware } from 'hono/factory'
import { html, raw } from 'hono/html'

export const rendererMiddleware = createMiddleware(
  async (c, next) => {
    c.setRenderer((content, { frontmatter }) => {
      const head = frontmatter
      return c.html(
        <html color-mode='dark'>
          <head>
            <meta charset='utf-8' />
            <meta
              name='viewport'
              content='width=device-width, initial-scale=1.0'
            />
            <link rel='shortcut icon' href='/favicon.ico' />
            <link
              rel='stylesheet'
              href='https://fonts.xz.style/serve/inter.css'
            />
            <link
              rel='stylesheet'
              href='https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css'
            />
            <link
              rel='stylesheet'
              href='https://newcss.net/theme/night.css'
            />
            <link
              rel='stylesheet'
              href='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css'
            />
            <link
              rel='stylesheet'
              href='https://cdn.jsdelivr.net/npm/tocbot@4/dist/tocbot.css'
            />
            {html`<style>
              h1,
              h2,
              h3,
              h4,
              h5 {
                border: none;
                padding-top: 2rem;
                margin-bottom: 1.5rem;
              }
              h2 {
                border-bottom: 1px solid #eee;
                padding-bottom: 1rem;
              }
              img {
                margin: 2rem 0;
              }
              #toc {
                font-size: 0.5rem;
                position: fixed;
                top: 10px;
                right: 10px;
                width: 200px;
                max-height: 80vh;
                padding: 10px;
                z-index: 1000;
              }
              #toc ol {
                list-style: none;
              }
              #toc a {
                text-decoration: none;
              }
              .toc-link::before {
                background-color: #333;
              }
              .is-active-link::before {
                background-color: #ef810f;
              }
              @media (max-width: 768px) {
                #toc {
                  display: none;
                }
              }
            </style>`}
            <title>{head.title}</title>
            <meta property='og:title' content={head.title} />
            {head.url ? (
              <meta property='og:url' content={head.url} />
            ) : (
              <></>
            )}
            {head.imageUrl ? (
              <meta property='og:image' content={head.imageUrl} />
            ) : (
              <></>
            )}
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:creator' content='@yusukebe' />
            {head.imageUrl ? (
              <meta
                name='twitter:image:src'
                content={head.imageUrl}
              />
            ) : (
              <></>
            )}
          </head>
          <body>
            <main>
              <div id='toc'></div>
              <div>{content}</div>
            </main>
            <br />
            <hr />
            <footer>
              <address>
                &copy; Yusuke Wada{' '}
                <a href='https://github.com/yusukebe'>
                  https://github.com/yusukebe
                </a>
              </address>
            </footer>
          </body>
          <script src='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js'></script>
          <script src='https://cdn.jsdelivr.net/npm/tocbot@4/dist/tocbot.min.js'></script>
          <script>
            {raw`hljs.highlightAll()
            tocbot.init({
              tocSelector: '#toc',
              contentSelector: 'main',
              headingSelector: 'h1, h2',
              headingsOffset: 40,
              scollSmoothOffset: -40
            })`}
          </script>
        </html>
      )
    })
    await next()
  }
)

export default rendererMiddleware
