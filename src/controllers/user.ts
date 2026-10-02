import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { generateToken } from '../helpers/token'
import { decode } from '../helpers/decode'
import { isAdminRequest } from '../helpers/auth'
import { errorMessage, pageOptions, paginationLabels, type ListQuery } from '../helpers/http'
import { validateEmail, validateLength } from '../helpers/validation'
import { User, type UserDoc } from '../models/User'
import { ensureRole } from '../seeders/roles'
import { ImageValidationError, uploadSingleImage } from './upload'

type IdParams = { id: string }

const PUBLIC_FIELDS = ['name', 'email', 'role', 'status', 'activate', 'profilePicture']

interface RegisterInput {
  name: string
  email: string
  password: string
  role?: string
  status?: string
  activate?: boolean
  profilePicture?: string
}

const isDuplicateBootstrap = (error: unknown) =>
  (error as { code?: number; keyPattern?: object })?.code === 11000 &&
  'isBootstrap' in ((error as { keyPattern?: object }).keyPattern ?? {})

export const register = async (req: Request<unknown, unknown, RegisterInput>, res: Response) => {
  try {
    const { name, email, role, status, password, activate, profilePicture } = req.body
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address.' })
    }
    const check = await User.findOne({ email })
    if (check) {
      return res.status(400).json({
        message: 'This email address already exists, please try with different email address.',
      })
    }

    if (!validateLength(name, 3, 30)) {
      return res.status(400).json({
        message: 'firstname must between 3 and 30 characters.',
      })
    }
    if (!validateLength(password, 6, 40)) {
      return res.status(400).json({
        message: 'password must be atleast 6 characters.',
      })
    }

    const account = {
      name,
      email,
      status,
      profilePicture,
      password: await bcrypt.hash(password, 12),
    }

    // On a fresh database the first account becomes an activated super admin. The
    // unique isBootstrap index lets only one of several simultaneous sign-ups win.
    let user = null
    if (!(await User.exists({}))) {
      try {
        user = await new User({
          ...account,
          role: (await ensureRole('super_admin'))._id,
          activate: true,
          isBootstrap: true,
        }).save()
      } catch (error) {
        if (!isDuplicateBootstrap(error)) throw error
      }
    }

    // Only admins (e.g. creating users from the admin panel) may choose the role and
    // activation; anyone else gets an inactive account with the basic user role.
    if (!user) {
      const byAdmin = await isAdminRequest(req)
      user = await new User({
        ...account,
        role: byAdmin && role ? role : (await ensureRole('user'))._id,
        activate: byAdmin ? Boolean(activate) : false,
      }).save()
    }

    res.send({
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        role: user.role,
        activate: user.activate,
        profilePicture: user.profilePicture,
      },
      message: 'Registrasi Sukses',
    })
  } catch (error) {
    res.status(500).json({ message: errorMessage(error) })
  }
}

/** Lets the frontend detect a fresh install and send people to registration first. */
export const getSetupStatus = async (_req: Request, res: Response) => {
  try {
    res.json({
      message: 'Successfully get data',
      data: { needsSetup: !(await User.exists({})) },
    })
  } catch (error) {
    res.status(500).json({ message: errorMessage(error) })
  }
}

export const login = async (
  req: Request<unknown, unknown, { email: string; password: string }>,
  res: Response
) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).populate('role', 'roleName allows title')
    if (!user) {
      return res.status(400).json({
        message: 'Email yang Anda masukan tidak ditemukan.',
      })
    }

    const check = await bcrypt.compare(password, user.password)
    if (!check) {
      return res.status(400).json({
        message: 'Password salah, mohon coba lagi.',
      })
    }
    if (!user.activate) {
      return res.status(400).json({
        message: 'Hubungi Admin untuk mengaktifkan akun.',
      })
    }

    const token = generateToken({ id: user._id.toString() }, '1d')
    res.send({
      data: {
        _id: user._id,
        name: user.name,
        status: user.status,
        role: user.role,
        activate: user.activate,
        profilePicture: user.profilePicture,
        accessToken: token,
      },
      message: 'Login Sukses',
    })
  } catch (error) {
    res.status(500).json({ message: errorMessage(error) })
  }
}

export const getMe = async (req: Request, res: Response) => {
  try {
    const decoded = decode(req)

    const user = await User.findOne({ _id: decoded.id }).populate('role', 'roleName allows title')

    if (!user) {
      return res.status(400).json({
        message: 'Profil tidak ditemukan',
      })
    }
    // Spreading the mongoose document (rather than `user.toJSON()`) is what the
    // frontend has always received: the fields live under `_doc`.
    return res.send({ ...user, message: 'Sukses' })
  } catch (error) {
    res.status(500).json({ message: errorMessage(error) })
  }
}

interface UpdateMeInput {
  name?: string
  email?: string
  password?: string
  currentPassword?: string
  profilePicture?: string
}

/**
 * Lets the logged-in user edit their own name, email, password and profile picture.
 * Changing email or password requires `currentPassword`. The picture can be sent as a
 * URL in `profilePicture` or as an uploaded file (multipart/form-data).
 */
export const updateMe = async (req: Request<unknown, unknown, UpdateMeInput>, res: Response) => {
  try {
    const decoded = decode(req)
    const { name, email, password, currentPassword, profilePicture } = req.body ?? {}

    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(400).json({
        message: 'Profil tidak ditemukan',
      })
    }

    const emailChanged = email !== undefined && email !== user.email
    if ((emailChanged || password) && !(currentPassword && (await bcrypt.compare(currentPassword, user.password)))) {
      return res.status(400).json({
        message: 'Password saat ini salah, mohon coba lagi.',
      })
    }

    if (name !== undefined) {
      if (!validateLength(name, 3, 30)) {
        return res.status(400).json({
          message: 'name must between 3 and 30 characters.',
        })
      }
      user.name = name
    }

    if (emailChanged) {
      if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email address.' })
      }
      if (await User.exists({ email, _id: { $ne: user._id } })) {
        return res.status(400).json({
          message: 'This email address already exists, please try with different email address.',
        })
      }
      user.email = email
    }

    if (password) {
      if (!validateLength(password, 6, 40)) {
        return res.status(400).json({
          message: 'password must be atleast 6 characters.',
        })
      }
      user.password = await bcrypt.hash(password, 12)
    }

    const uploadImage = await uploadSingleImage(req)
    if (uploadImage) {
      user.profilePicture = uploadImage
    } else if (profilePicture) {
      user.profilePicture = profilePicture
    }

    await user.save()

    const updated = await User.findById(user._id)
      .select(PUBLIC_FIELDS)
      .populate('role', 'roleName allows title')
    res.json({
      message: 'Profil berhasil diperbarui.',
      data: updated,
    })
  } catch (error) {
    res.status(error instanceof ImageValidationError ? 400 : 500).json({ message: errorMessage(error) })
  }
}

export const getUserById = async (req: Request<IdParams>, res: Response) => {
  try {
    const user = await User.findOne({ _id: req.params.id })
      .select(PUBLIC_FIELDS)
      .populate('role', 'roleName allows')
    if (!user) {
      return res.status(400).json({
        message: 'Profil tidak ditemukan',
      })
    }
    return res.json(user)
  } catch (error) {
    res.status(500).json({ message: errorMessage(error) })
  }
}

export const editUser = async (req: Request<IdParams, unknown, Partial<UserDoc>>, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        ...req.body,
        status: req.body.status || 'retail',
      },
      { new: true }
    )
      .select(PUBLIC_FIELDS)
      .populate('role', 'roleName title')
    if (!user) {
      return res.status(400).json({
        message: 'Profil tidak ditemukan',
      })
    }
    return res.json(user)
  } catch (error) {
    res.status(500).json({ message: errorMessage(error) })
  }
}

export const getAllUser = async (req: Request<unknown, unknown, unknown, ListQuery>, res: Response) => {
  try {
    const decoded = decode(req)
    const { q } = req.query
    const user = await User.paginate(
      {
        name: { $regex: q || '', $options: 'i' },
        _id: { $ne: decoded.id },
      },
      {
        ...pageOptions(req.query),
        sort: { createdAt: 1 },
        populate: { path: 'role', select: 'roleName title' },
        customLabels: paginationLabels,
        select: PUBLIC_FIELDS,
      }
    )

    res.json({
      message: 'Successfully get data',
      data: user,
    })
  } catch (error) {
    res.status(500).json({ message: errorMessage(error) })
  }
}

export const deleteUser = async (req: Request<IdParams>, res: Response) => {
  try {
    const user = await User.findByIdAndDelete({ _id: req.params.id })
    if (!user) {
      return res.status(400).json({
        message: 'Profil tidak ditemukan',
      })
    }
    res.json({
      message: 'Pengguna berhasil dihapus.',
      data: user,
    })
  } catch (error) {
    res.status(500).json({ message: errorMessage(error) })
  }
}
