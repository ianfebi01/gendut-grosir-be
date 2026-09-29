/**
 * Seeds roles, a restaurant menu (with its categories), one super admin account and
 * two months of mock completed orders for that menu.
 *
 *   npm run seed
 *
 * Safe to re-run: existing roles, categories, products and users are matched by
 * name/email and left untouched, so stock and passwords changed in the app survive.
 * Mock orders are only created when no order contains a seeded product yet.
 * The super admin login comes from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD.
 */
import bcrypt from 'bcrypt'
import moment from 'moment'
import mongoose from 'mongoose'
import orderIdFactory from 'order-id'
import { env } from '../config'
import { Category } from '../models/Category'
import { Order } from '../models/Order'
import { Product } from '../models/Product'
import { Role } from '../models/Role'
import { User } from '../models/User'
import { products, roles } from './data'

const ADMIN_NAME = process.env.SEED_ADMIN_NAME || 'Super Admin'
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'superadmin@gmail.com'
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'superadmin123'

const ORDER_DAYS = 60

// Same secret as the order controller, so `getTime` works on seeded order ids.
const orderid = orderIdFactory('key')

/** Small seeded PRNG so every fresh seed produces the same mock orders. */
const createRandom = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const seedRoles = async () => {
  for (const role of roles) {
    const { upsertedCount } = await Role.updateOne(
      { roleName: role.roleName },
      { $setOnInsert: role },
      { upsert: true }
    )
    console.log(`role ${role.roleName}: ${upsertedCount ? 'created' : 'exists'}`)
  }
}

const seedProducts = async () => {
  const categoryIds = new Map<string, mongoose.Types.ObjectId>()
  for (const name of new Set(products.map((p) => p.category))) {
    const category = (await Category.findOne({ name })) ?? (await new Category({ name }).save())
    categoryIds.set(name, category._id)
  }

  let created = 0
  for (const { category, ...product } of products) {
    const { upsertedCount } = await Product.updateOne(
      { name: product.name },
      { $setOnInsert: { ...product, category: categoryIds.get(category) } },
      { upsert: true, timestamps: true }
    )
    created += upsertedCount
  }
  console.log(`products: ${created} created, ${products.length - created} already existed`)
}

const seedSuperAdmin = async () => {
  const existing = await User.findOne({ email: ADMIN_EMAIL })
  if (existing) {
    console.log(`super admin ${ADMIN_EMAIL}: exists (left unchanged)`)
    return existing
  }
  const role = await Role.findOne({ roleName: 'super_admin' })
  if (!role) throw new Error('super_admin role is missing')

  const user = await new User({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: await bcrypt.hash(ADMIN_PASSWORD, 12),
    role: role._id,
    status: 'wholesaler',
    activate: true,
  }).save()
  console.log(`super admin ${ADMIN_EMAIL}: created`)
  return user
}

/** Opening hours as [from, to) in minutes; most orders land in the lunch and dinner rush. */
const SERVICE_WINDOWS = [
  { from: 10 * 60, to: 21 * 60, weight: 0.3 }, // all day
  { from: 11 * 60 + 30, to: 13 * 60 + 30, weight: 0.4 }, // lunch
  { from: 18 * 60, to: 20 * 60, weight: 0.3 }, // dinner
]

/** 15–35 completed dine-in orders a day, for the last ORDER_DAYS days. */
const seedOrders = async (cashier: mongoose.Types.ObjectId) => {
  const seeded = await Product.find({ name: { $in: products.map((p) => p.name) } }).populate<{
    category: { name: string }
  }>('category', 'name')
  if (await Order.exists({ 'details.product': { $in: seeded.map((p) => p._id) } })) {
    console.log('orders: seeded products already have orders, skipped')
    return
  }

  const random = createRandom(20260929)
  const pick = (min: number, max: number) => min + Math.floor(random() * (max - min + 1))
  const sample = <T>(list: T[], count: number) => [...list].sort(() => random() - 0.5).slice(0, count)
  const serviceMinute = () => {
    let roll = random()
    const window = SERVICE_WINDOWS.find((w) => (roll -= w.weight) < 0) ?? SERVICE_WINDOWS[0]
    return pick(window.from, window.to - 1)
  }

  const drinks = seeded.filter((p) => p.category.name === 'Minuman')
  const food = seeded.filter((p) => p.category.name !== 'Minuman')
  const now = moment()
  const orders = []

  for (let day = ORDER_DAYS; day >= 0; day--) {
    // Weekends are busier.
    const weekend = [0, 6].includes(moment(now).subtract(day, 'days').day())
    for (let n = weekend ? pick(25, 35) : pick(15, 25); n > 0; n--) {
      const date = moment(now).subtract(day, 'days').startOf('day').add(serviceMinute(), 'minutes')
      if (date.isAfter(now)) continue

      // A table orders 1–3 dishes and usually something to drink.
      const items = [...sample(food, pick(1, 3)), ...(random() < 0.8 ? sample(drinks, pick(1, 2)) : [])]
      const details = items.map((product) => ({
        product: product._id,
        qty: pick(1, 3),
        price: product.retailPrice ?? product.wholesalerPrice,
        buyPrice: product.buyPrice,
      }))

      orders.push({
        user: cashier,
        date: date.toDate(),
        orderId: orderid.generate(date.toDate()),
        total: details.reduce((a, c) => a + c.price * c.qty, 0),
        totalQty: details.reduce((a, c) => a + c.qty, 0),
        totalBuyPrice: details.reduce((a, c) => a + c.buyPrice * c.qty, 0),
        details: details.map(({ buyPrice, ...detail }) => detail),
        status: 'complete',
        createdAt: date.toDate(),
        updatedAt: date.toDate(),
      })
    }
  }

  // Timestamps are set explicitly so the orders appear on their own day.
  await Order.insertMany(orders, { timestamps: false } as mongoose.InsertManyOptions)
  console.log(`orders: ${orders.length} created over the last ${ORDER_DAYS} days`)
}

const main = async () => {
  if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set')

  mongoose.set('strictQuery', false)
  await mongoose.connect(env.DATABASE_URL)
  const { host, name } = mongoose.connection
  console.log(`seeding ${name} on ${host}`)

  try {
    await seedRoles()
    await seedProducts()
    const admin = await seedSuperAdmin()
    await seedOrders(admin._id)
  } finally {
    await mongoose.disconnect()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
