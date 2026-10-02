import { User } from '../models/User'

export const validateEmail = (email: unknown) => {
  return String(email)
    .toLocaleLowerCase()
    .match(/^([a-z\d.-]+)@([a-z\-]{2,12})(\.[a-z\-]{2,12})?$/)
}

export const validateLength = (text: string | undefined, min: number, max: number): boolean => {
  const length = text?.length ?? 0
  return length >= min && length <= max
}

export const validateUsername = async (username: string): Promise<string> => {
  let taken = false
  do {
    const check = await User.findOne({ username })
    if (check) {
      username += (+new Date() * Math.random()).toString().substring(0, 1)
      taken = true
    } else {
      taken = false
    }
  } while (taken)
  return username
}
