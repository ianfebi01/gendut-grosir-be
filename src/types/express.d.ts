import type { JwtPayload } from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      /** Decoded JWT payload, set by the `authUser` middleware. */
      user?: TokenPayload
    }
  }
}

export interface TokenPayload extends JwtPayload {
  id: string
}
