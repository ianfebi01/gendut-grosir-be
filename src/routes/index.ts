import { Router } from 'express'
import analytic from './analytic'
import category from './category'
import menu from './menu'
import order from './order'
import product from './product'
import role from './role'
import stockOpname from './stockOpname'
import upload from './upload'
import user from './user'

// Mounted in the same (alphabetical) order the old `readdirSync('./routes')` loader used.
export const routers: Router[] = [
  analytic,
  category,
  menu,
  order,
  product,
  role,
  stockOpname,
  upload,
  user,
]
