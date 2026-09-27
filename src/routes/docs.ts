import { Router } from 'express'
import { openapi } from '../docs/openapi'

const router = Router()

const swaggerUiHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Gendut Grosir API</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({ url: './openapi.json', dom_id: '#swagger-ui', persistAuthorization: true })
    </script>
  </body>
</html>`

router.get('/openapi.json', (_req, res) => res.json(openapi))
router.get('/docs', (_req, res) => res.type('html').send(swaggerUiHtml))

export default router
