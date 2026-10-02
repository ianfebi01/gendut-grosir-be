import mongoose, { type InferSchemaType } from 'mongoose'

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  access: {
    type: Array,
    required: true,
  },
  children: [
    {
      name: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      access: {
        type: Array,
        required: true,
      },
    },
  ],
})

export type MenuDoc = InferSchemaType<typeof menuSchema>

export const Menu = mongoose.model('Menu', menuSchema)
