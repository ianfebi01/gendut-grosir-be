import { Role } from '../models/Role'
import { roles } from './data'

/**
 * Inserts the default roles, but only into an empty roles collection: once any role
 * exists the collection is managed from the app and left alone. Runs on every app start.
 * Returns the names of the roles it created.
 */
export const seedRoles = async (): Promise<string[]> => {
  if (await Role.exists({})) return []

  const created = await Role.insertMany(roles)
  return created.map((role) => role.roleName)
}

/** Finds a default role by name, creating it if the startup seed hasn't run yet. */
export const ensureRole = async (roleName: string) => {
  const definition = roles.find((role) => role.roleName === roleName)
  if (!definition) throw new Error(`Unknown default role ${roleName}`)
  await Role.updateOne({ roleName }, { $setOnInsert: definition }, { upsert: true })
  const role = await Role.findOne({ roleName })
  if (!role) throw new Error(`Role ${roleName} is missing`)
  return role
}
