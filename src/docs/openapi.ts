import type { OpenAPIV3 } from 'openapi-types'

type Schema = OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject

const ref = (name: string): OpenAPIV3.ReferenceObject => ({ $ref: `#/components/schemas/${name}` })
const arrayOf = (items: Schema): OpenAPIV3.SchemaObject => ({ type: 'array', items })

const json = (schema: Schema) => ({ 'application/json': { schema } })

const body = (schema: Schema, required = true): OpenAPIV3.RequestBodyObject => ({
  required,
  content: json(schema),
})

const response = (description: string, schema: Schema): OpenAPIV3.ResponseObject => ({
  description,
  content: json(schema),
})

/** `{ message, data }` envelope used by most endpoints. */
const envelope = (data: Schema): OpenAPIV3.SchemaObject => ({
  type: 'object',
  properties: { message: { type: 'string' }, data },
})

/** mongoose-paginate result with the app's custom labels. */
const page = (item: Schema): OpenAPIV3.SchemaObject => ({
  type: 'object',
  properties: { data: arrayOf(item), paginator: ref('Paginator') },
})

const errors = {
  400: { $ref: '#/components/responses/BadRequest' },
  401: { $ref: '#/components/responses/Unauthorized' },
  500: { $ref: '#/components/responses/ServerError' },
} satisfies OpenAPIV3.ResponsesObject

const pathParam = (name: string, description?: string): OpenAPIV3.ParameterObject => ({
  name,
  in: 'path',
  required: true,
  description,
  schema: { type: 'string' },
})

const listParams: OpenAPIV3.ReferenceObject[] = [
  { $ref: '#/components/parameters/q' },
  { $ref: '#/components/parameters/limit' },
  { $ref: '#/components/parameters/page' },
]

const auth: OpenAPIV3.SecurityRequirementObject[] = [{ bearerAuth: [] }]
const publicEndpoint: OpenAPIV3.SecurityRequirementObject[] = []

const adminOnly = 'Requires an `admin` or `super_admin` role.'

const objectId: OpenAPIV3.SchemaObject = { type: 'string', example: '639dcb25851834d7005e0b9c' }
const timestamps = {
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
} satisfies Record<string, OpenAPIV3.SchemaObject>

export const openapi: OpenAPIV3.Document = {
  openapi: '3.0.3',
  info: {
    title: 'Gendut Grosir API',
    version: '1.0.0',
    description:
      'Backend for the Gendut Grosir point-of-sale and inventory app. ' +
      'Authenticate with `POST /login` and send the returned `accessToken` as a Bearer token.',
  },
  servers: [{ url: '/' }],
  security: auth,
  tags: [
    { name: 'Auth & Users', description: 'Login, registration and user management' },
    { name: 'Roles', description: 'Roles and the app features each role may access' },
    { name: 'Menus', description: 'Navigation menu definitions' },
    { name: 'Categories', description: 'Product categories' },
    { name: 'Products', description: 'Product catalogue and stock' },
    { name: 'Orders', description: 'Point-of-sale orders' },
    { name: 'Stock Opname', description: 'Physical stock counts' },
    { name: 'Uploads', description: 'Cloudinary image uploads' },
    { name: 'Analytics', description: 'Sales reporting' },
  ],
  paths: {
    // ---------------------------------------------------------------- Auth & Users
    '/login': {
      post: {
        tags: ['Auth & Users'],
        operationId: 'login',
        summary: 'Log in',
        security: publicEndpoint,
        requestBody: body({
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' },
          },
        }),
        responses: {
          200: response(
            'Logged in',
            envelope({
              allOf: [
                ref('UserSummary'),
                {
                  type: 'object',
                  properties: { accessToken: { type: 'string', description: 'JWT, valid for 1 day' } },
                },
              ],
            })
          ),
          400: { $ref: '#/components/responses/BadRequest' },
          500: errors[500],
        },
      },
    },
    '/register': {
      post: {
        tags: ['Auth & Users'],
        operationId: 'register',
        summary: 'Register a user',
        security: publicEndpoint,
        requestBody: body({
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', minLength: 3, maxLength: 30 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password', minLength: 6, maxLength: 40 },
            role: { ...objectId, description: 'Role id' },
            status: { type: 'string', example: 'retail' },
            activate: { type: 'boolean', default: false },
            profilePicture: { type: 'string', format: 'uri' },
          },
        }),
        responses: {
          200: response('Registered', envelope(ref('User'))),
          400: errors[400],
          500: errors[500],
        },
      },
    },
    '/me': {
      get: {
        tags: ['Auth & Users'],
        operationId: 'getMe',
        summary: 'Current user',
        description:
          'Returns the raw mongoose document spread into the response, so the user fields ' +
          'are under `_doc` (with the populated role) alongside mongoose internals.',
        responses: {
          200: response('Current user', {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Sukses' },
              _doc: ref('UserWithRole'),
            },
            additionalProperties: true,
          }),
          ...errors,
        },
      },
    },
    '/getAllUser': {
      get: {
        tags: ['Auth & Users'],
        operationId: 'getAllUser',
        summary: 'List users (excluding the caller)',
        description: adminOnly,
        parameters: listParams,
        responses: { 200: response('Users', envelope(page(ref('UserWithRole')))), ...errors },
      },
    },
    '/getUserById/{id}': {
      get: {
        tags: ['Auth & Users'],
        operationId: 'getUserById',
        summary: 'Get a user',
        parameters: [pathParam('id')],
        responses: { 200: response('User', ref('UserWithRole')), ...errors },
      },
    },
    '/editUser/{id}': {
      put: {
        tags: ['Auth & Users'],
        operationId: 'editUser',
        summary: 'Update a user',
        description: `${adminOnly} \`status\` defaults to \`retail\` when omitted.`,
        parameters: [pathParam('id')],
        requestBody: body(ref('UserInput')),
        responses: { 200: response('Updated user', ref('UserWithRole')), ...errors },
      },
    },
    '/deleteUser/{id}': {
      delete: {
        tags: ['Auth & Users'],
        operationId: 'deleteUser',
        summary: 'Delete a user',
        description: adminOnly,
        parameters: [pathParam('id')],
        responses: { 200: response('Deleted user', envelope(ref('User'))), ...errors },
      },
    },

    // ---------------------------------------------------------------- Roles
    '/getRole': {
      get: {
        tags: ['Roles'],
        operationId: 'getRole',
        summary: 'List roles',
        security: publicEndpoint,
        parameters: listParams,
        responses: {
          200: response('Roles', {
            allOf: [{ type: 'object', properties: { message: { type: 'string' } } }, page(ref('Role'))],
          }),
          500: errors[500],
        },
      },
    },
    '/post-default-role': {
      post: {
        tags: ['Roles'],
        operationId: 'postDefaultRole',
        summary: 'Seed roles',
        description: 'Only succeeds while the roles collection is empty.',
        security: publicEndpoint,
        requestBody: body(arrayOf(ref('RoleInput'))),
        responses: {
          200: response('Created roles', envelope(arrayOf(ref('Role')))),
          400: errors[400],
          500: errors[500],
        },
      },
    },
    '/updateRole/{id}': {
      put: {
        tags: ['Roles'],
        operationId: 'updateRole',
        summary: "Update a role's permissions",
        description: '`allows` must include `pos`. The `super_admin` role cannot be changed.',
        security: publicEndpoint,
        parameters: [pathParam('id')],
        requestBody: body({
          type: 'object',
          required: ['allows'],
          properties: { allows: arrayOf({ type: 'string' }) },
        }),
        responses: {
          200: response('Updated role', envelope(ref('Role'))),
          404: { $ref: '#/components/responses/NotFound' },
          500: errors[500],
        },
      },
    },

    // ---------------------------------------------------------------- Menus
    '/menu': {
      get: {
        tags: ['Menus'],
        operationId: 'getMenu',
        summary: 'List menus',
        responses: { 200: response('Menus', envelope(arrayOf(ref('Menu')))), ...errors },
      },
      post: {
        tags: ['Menus'],
        operationId: 'postMenu',
        summary: 'Create a menu',
        description: adminOnly,
        requestBody: body(ref('MenuInput')),
        responses: { 200: response('Created menu', envelope(ref('Menu'))), ...errors },
      },
    },
    '/default-menu': {
      post: {
        tags: ['Menus'],
        operationId: 'postDefaultMenu',
        summary: 'Create menus in bulk',
        description: adminOnly,
        requestBody: body(arrayOf(ref('MenuInput'))),
        responses: { 200: response('Created menus', envelope(arrayOf(ref('Menu')))), ...errors },
      },
    },

    // ---------------------------------------------------------------- Categories
    '/category': {
      get: {
        tags: ['Categories'],
        operationId: 'getCategory',
        summary: 'List categories with product counts',
        description: 'Unlike most list endpoints, the paginated result is returned without an envelope.',
        parameters: listParams,
        responses: {
          200: response(
            'Categories',
            page({
              type: 'object',
              properties: {
                _id: objectId,
                name: { type: 'string' },
                totalProducts: { type: 'integer' },
              },
            })
          ),
          ...errors,
        },
      },
      post: {
        tags: ['Categories'],
        operationId: 'postCategory',
        summary: 'Create a category',
        requestBody: body({ type: 'object', required: ['name'], properties: { name: { type: 'string' } } }),
        responses: {
          201: response('Created category', envelope(ref('Category'))),
          ...errors,
          500: { description: 'Server error, or `name` was blank', content: json(ref('Message')) },
        },
      },
    },
    '/category/{id}': {
      put: {
        tags: ['Categories'],
        operationId: 'updateCategory',
        summary: 'Rename a category',
        parameters: [pathParam('id')],
        requestBody: body({ type: 'object', properties: { name: { type: 'string' } } }),
        responses: {
          200: response('Updated category', envelope(ref('Category'))),
          404: { $ref: '#/components/responses/NotFound' },
          ...errors,
        },
      },
      delete: {
        tags: ['Categories'],
        operationId: 'deleteCategory',
        summary: 'Delete a category',
        parameters: [pathParam('id')],
        responses: {
          200: response('Deleted category (null if it did not exist)', envelope(ref('Category'))),
          ...errors,
        },
      },
    },

    // ---------------------------------------------------------------- Products
    '/product': {
      get: {
        tags: ['Products'],
        operationId: 'getProduct',
        summary: 'List products',
        parameters: [
          ...listParams,
          { name: 'category', in: 'query', description: 'Category id', schema: { type: 'string' } },
        ],
        responses: { 200: response('Products', envelope(page(ref('Product')))), ...errors },
      },
      post: {
        tags: ['Products'],
        operationId: 'postProduct',
        summary: 'Create a product',
        description: `${adminOnly} Send as \`multipart/form-data\` to attach an image.`,
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: ref('ProductInput') },
            'multipart/form-data': { schema: ref('ProductMultipartInput') },
          },
        },
        responses: { 200: response('Created product', envelope(ref('Product'))), ...errors },
      },
    },
    '/product/{id}': {
      get: {
        tags: ['Products'],
        operationId: 'getProductById',
        summary: 'Get a product',
        parameters: [pathParam('id')],
        responses: {
          200: response('Product', envelope(ref('Product'))),
          404: { $ref: '#/components/responses/NotFound' },
          ...errors,
        },
      },
      put: {
        tags: ['Products'],
        operationId: 'updateProduct',
        summary: 'Update a product',
        description: `${adminOnly} Send as \`multipart/form-data\` to replace the image.`,
        parameters: [pathParam('id')],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: ref('ProductInput') },
            'multipart/form-data': { schema: ref('ProductMultipartInput') },
          },
        },
        responses: {
          200: response('Updated product', envelope(ref('Product'))),
          404: { $ref: '#/components/responses/NotFound' },
          ...errors,
        },
      },
      delete: {
        tags: ['Products'],
        operationId: 'deleteProduct',
        summary: 'Delete a product',
        description: adminOnly,
        parameters: [pathParam('id')],
        responses: {
          200: response('Deleted product', envelope(ref('Product'))),
          404: { $ref: '#/components/responses/NotFound' },
          ...errors,
        },
      },
    },
    '/productByBarcode/{barcode}': {
      get: {
        tags: ['Products'],
        operationId: 'getProductByBarcode',
        summary: 'Find a product by barcode',
        parameters: [pathParam('barcode')],
        responses: {
          200: response('Product', envelope(ref('Product'))),
          404: { $ref: '#/components/responses/NotFound' },
          ...errors,
        },
      },
    },
    '/product/stockbarcode/{barcode}': {
      put: {
        tags: ['Products'],
        operationId: 'updateProductStockByBarcode',
        summary: "Increment a product's stock by 1",
        description: adminOnly,
        parameters: [pathParam('barcode')],
        responses: {
          200: response('Updated product', envelope(ref('Product'))),
          404: { $ref: '#/components/responses/NotFound' },
          ...errors,
        },
      },
    },

    // ---------------------------------------------------------------- Orders
    '/order': {
      get: {
        tags: ['Orders'],
        operationId: 'getOrder',
        summary: 'List orders',
        description: `${adminOnly} \`q\` filters by order id.`,
        parameters: listParams,
        responses: { 200: response('Orders', envelope(page(ref('Order')))), ...errors },
      },
      post: {
        tags: ['Orders'],
        operationId: 'postOrder',
        summary: 'Create an order',
        description:
          'Decrements stock for each line item. Lines whose product has insufficient stock are ' +
          'silently dropped from the saved order (totals are still computed from the request).',
        requestBody: body(ref('OrderInput')),
        responses: { 200: response('Created order', envelope(ref('Order'))), ...errors },
      },
    },
    '/changeStatusOrder/{orderId}': {
      put: {
        tags: ['Orders'],
        operationId: 'changeStatusOrder',
        summary: 'Mark an order complete',
        parameters: [pathParam('orderId', 'Human-readable order id, not the Mongo _id')],
        responses: { 200: response('Updated order', envelope(ref('Order'))), ...errors },
      },
    },
    '/cancelOrder/{orderId}': {
      put: {
        tags: ['Orders'],
        operationId: 'cancelOrder',
        summary: 'Cancel an order and restock its items',
        parameters: [pathParam('orderId', 'Human-readable order id, not the Mongo _id')],
        responses: {
          200: response('Cancelled order', envelope(ref('Order'))),
          404: { $ref: '#/components/responses/NotFound' },
          ...errors,
        },
      },
    },
    '/order/updateTime': {
      get: {
        tags: ['Orders'],
        operationId: 'updateTime',
        summary: 'Randomise order dates (dev utility)',
        description:
          '**Unauthenticated and destructive:** rewrites every order `date` to a random time ' +
          'up to 30 days before its `createdAt`. Intended for seeding demo data only.',
        security: publicEndpoint,
        responses: {
          200: response('All orders after the update', {
            type: 'object',
            properties: { minus: arrayOf(ref('Order')) },
          }),
          500: errors[500],
        },
      },
    },

    // ---------------------------------------------------------------- Stock Opname
    '/stockOpname': {
      get: {
        tags: ['Stock Opname'],
        operationId: 'getStockOpname',
        summary: 'List stock opnames',
        description: `${adminOnly} \`q\` filters by opname id.`,
        parameters: listParams,
        responses: { 200: response('Stock opnames', envelope(page(ref('StockOpname')))), ...errors },
      },
      post: {
        tags: ['Stock Opname'],
        operationId: 'postStockOpname',
        summary: 'Record a stock count',
        description: `${adminOnly} With \`apply: true\`, each product's stock is set to its \`realQty\` immediately.`,
        requestBody: body(ref('StockOpnameInput')),
        responses: { 200: response('Created stock opname', envelope(ref('StockOpname'))), ...errors },
      },
    },
    '/stockOpname/{id}': {
      put: {
        tags: ['Stock Opname'],
        operationId: 'applyStockOpname',
        summary: 'Apply a stock count',
        description: `${adminOnly} Sets each product's stock to its counted \`realQty\`.`,
        parameters: [pathParam('id')],
        responses: {
          200: response('Applied stock opname', envelope(ref('StockOpname'))),
          403: { description: 'Already applied', content: json(ref('Message')) },
          404: { $ref: '#/components/responses/NotFound' },
          ...errors,
        },
      },
    },

    // ---------------------------------------------------------------- Uploads
    '/uploadImages': {
      post: {
        tags: ['Uploads'],
        operationId: 'uploadImages',
        summary: 'Upload images to Cloudinary',
        description: `${adminOnly} JPEG, PNG, GIF or WebP, up to 10 MB each.`,
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  path: { type: 'string', description: 'Cloudinary folder' },
                  file: arrayOf({ type: 'string', format: 'binary' }),
                },
              },
            },
          },
        },
        responses: {
          200: response(
            'Cloudinary upload results',
            arrayOf({ type: 'object', additionalProperties: true, properties: { secure_url: { type: 'string' } } })
          ),
          ...errors,
        },
      },
    },
    '/deleteImage': {
      post: {
        tags: ['Uploads'],
        operationId: 'deleteImage',
        summary: 'Delete an image from Cloudinary',
        description: adminOnly,
        requestBody: body({
          type: 'object',
          required: ['publicId'],
          properties: { publicId: { type: 'string' } },
        }),
        responses: {
          200: response('Cloudinary destroy result', {
            type: 'object',
            properties: { result: { type: 'string', example: 'ok' } },
          }),
          ...errors,
        },
      },
    },

    // ---------------------------------------------------------------- Analytics
    '/analytic': {
      get: {
        tags: ['Analytics'],
        operationId: 'getAnalytic',
        summary: 'Daily sales totals',
        description: 'Defaults to the current month when `start`/`end` are omitted. `end` is inclusive.',
        parameters: [
          { name: 'start', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'end', in: 'query', schema: { type: 'string', format: 'date' } },
        ],
        responses: {
          200: response('Per-day totals', {
            type: 'object',
            properties: {
              message: { type: 'string' },
              filterBy: { type: 'string', example: 'Day' },
              data: arrayOf(ref('DailySales')),
            },
          }),
          ...errors,
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    parameters: {
      q: { name: 'q', in: 'query', description: 'Case-insensitive search', schema: { type: 'string' } },
      limit: { name: 'limit', in: 'query', schema: { type: 'integer', default: 25 } },
      page: { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
    },
    responses: {
      BadRequest: { description: 'Invalid request', content: json(ref('Message')) },
      Unauthorized: {
        description: 'Missing/invalid token, or insufficient role',
        content: json(ref('Message')),
      },
      NotFound: { description: 'Not found', content: json(ref('Message')) },
      ServerError: { description: 'Server error', content: json(ref('Message')) },
    },
    schemas: {
      Message: {
        type: 'object',
        required: ['message'],
        properties: { message: { type: 'string' } },
      },
      Paginator: {
        type: 'object',
        properties: {
          itemCount: { type: 'integer' },
          limit: { type: 'integer' },
          page: { type: 'integer' },
          totalPages: { type: 'integer' },
          pagingCounter: { type: 'integer' },
          hasPrevPage: { type: 'boolean' },
          hasNextPage: { type: 'boolean' },
          prevPage: { type: 'integer', nullable: true },
          nextPage: { type: 'integer', nullable: true },
        },
      },
      Role: {
        type: 'object',
        properties: {
          _id: objectId,
          roleName: { type: 'string', example: 'super_admin' },
          title: { type: 'string', example: 'Super Admin' },
          allows: arrayOf({ type: 'string', example: 'pos' }),
        },
      },
      RoleInput: {
        type: 'object',
        required: ['roleName', 'title'],
        properties: {
          roleName: { type: 'string' },
          title: { type: 'string' },
          allows: arrayOf({ type: 'string' }),
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: objectId,
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { ...objectId, description: 'Role id' },
          status: { type: 'string', example: 'retail' },
          activate: { type: 'boolean' },
          profilePicture: { type: 'string', format: 'uri' },
        },
      },
      UserWithRole: {
        allOf: [ref('User'), { type: 'object', properties: { role: ref('Role') } }],
      },
      UserSummary: {
        type: 'object',
        properties: {
          _id: objectId,
          name: { type: 'string' },
          status: { type: 'string' },
          role: ref('Role'),
          activate: { type: 'boolean' },
          profilePicture: { type: 'string', format: 'uri' },
        },
      },
      UserInput: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { ...objectId, description: 'Role id' },
          status: { type: 'string' },
          activate: { type: 'boolean' },
          profilePicture: { type: 'string', format: 'uri' },
        },
      },
      MenuItem: {
        type: 'object',
        required: ['name', 'url', 'access'],
        properties: {
          name: { type: 'string' },
          url: { type: 'string' },
          access: arrayOf({ type: 'string' }),
        },
      },
      MenuInput: {
        allOf: [ref('MenuItem'), { type: 'object', properties: { children: arrayOf(ref('MenuItem')) } }],
      },
      Menu: {
        allOf: [ref('MenuInput'), { type: 'object', properties: { _id: objectId } }],
      },
      Category: {
        type: 'object',
        properties: { _id: objectId, name: { type: 'string' }, ...timestamps },
      },
      ProductInput: {
        type: 'object',
        required: ['category', 'buyPrice', 'wholesalerPrice'],
        properties: {
          name: { type: 'string' },
          category: { ...objectId, description: 'Category id' },
          details: { type: 'string' },
          buyPrice: { type: 'number' },
          wholesalerPrice: { type: 'number' },
          retailPrice: { type: 'number' },
          barcode: { type: 'number' },
          image: { type: 'string', format: 'uri' },
          stock: { type: 'number', default: 0 },
        },
      },
      ProductMultipartInput: {
        allOf: [
          ref('ProductInput'),
          {
            type: 'object',
            properties: {
              image: { type: 'string', format: 'binary', description: 'JPEG/PNG/GIF/WebP, max 10 MB' },
            },
          },
        ],
      },
      Product: {
        type: 'object',
        properties: {
          _id: objectId,
          name: { type: 'string' },
          category: {
            type: 'object',
            properties: { _id: objectId, name: { type: 'string' } },
          },
          details: { type: 'string' },
          buyPrice: { type: 'number' },
          wholesalerPrice: { type: 'number' },
          retailPrice: { type: 'number' },
          barcode: { type: 'number' },
          image: { type: 'string', format: 'uri' },
          stock: { type: 'number' },
          ...timestamps,
        },
      },
      OrderInput: {
        type: 'object',
        required: ['details'],
        properties: {
          user: { ...objectId, description: 'Defaults to the authenticated user' },
          status: { type: 'string', enum: ['process', 'complete'], default: 'process' },
          details: arrayOf({
            type: 'object',
            required: ['product', 'qty', 'price', 'buyPrice'],
            properties: {
              product: { ...objectId, description: 'Product id' },
              qty: { type: 'integer', minimum: 1 },
              price: { type: 'number', description: 'Unit selling price' },
              buyPrice: { type: 'number', description: 'Unit cost, used for profit' },
            },
          }),
        },
      },
      Order: {
        type: 'object',
        properties: {
          _id: objectId,
          orderId: { type: 'string', example: '3717-651291-0426' },
          user: {
            type: 'object',
            description: 'Populated user (fields vary by endpoint)',
            properties: { _id: objectId, name: { type: 'string' }, status: { type: 'string' } },
          },
          date: { type: 'string', format: 'date-time' },
          total: { type: 'number' },
          totalQty: { type: 'number' },
          totalBuyPrice: { type: 'number' },
          status: { type: 'string', enum: ['process', 'complete', 'cancel'] },
          details: arrayOf({
            type: 'object',
            properties: {
              _id: objectId,
              product: ref('Product'),
              qty: { type: 'number' },
              price: { type: 'number' },
            },
          }),
          ...timestamps,
        },
      },
      StockOpnameLine: {
        type: 'object',
        required: ['product', 'systemQty', 'realQty', 'difference'],
        properties: {
          product: { ...objectId, description: 'Product id' },
          systemQty: { type: 'number', description: 'Stock according to the system' },
          realQty: { type: 'number', description: 'Physically counted stock' },
          difference: { type: 'number', description: '`realQty - systemQty`' },
        },
      },
      StockOpnameInput: {
        type: 'object',
        required: ['product'],
        properties: {
          date: { type: 'string', format: 'date-time' },
          apply: { type: 'boolean', default: false },
          product: arrayOf(ref('StockOpnameLine')),
        },
      },
      StockOpname: {
        type: 'object',
        properties: {
          _id: objectId,
          opnameId: { type: 'string' },
          date: { type: 'string', format: 'date-time' },
          user: { type: 'object', properties: { _id: objectId, name: { type: 'string' } } },
          apply: { type: 'boolean' },
          product: arrayOf({
            allOf: [
              ref('StockOpnameLine'),
              {
                type: 'object',
                properties: {
                  _id: objectId,
                  product: { type: 'object', properties: { _id: objectId, name: { type: 'string' } } },
                },
              },
            ],
          }),
          ...timestamps,
        },
      },
      DailySales: {
        type: 'object',
        properties: {
          _id: { type: 'string', format: 'date', description: 'Day (YYYY-MM-DD)' },
          totalQty: { type: 'number' },
          totalSalesTurnover: { type: 'number' },
          totalSalesBuyPrice: { type: 'number' },
          totalProfit: { type: 'number' },
        },
      },
    },
  },
}
