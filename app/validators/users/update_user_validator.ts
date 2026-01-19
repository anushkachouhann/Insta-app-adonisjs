import vine from '@vinejs/vine'

export const updateUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100).optional(),
    email: vine.string().trim().email().optional(),
    username: vine.string().trim().minLength(3).maxLength(50).optional(),
    password: vine.string().minLength(6).maxLength(100).optional(),
    bio: vine.string().trim().maxLength(500).optional(),
    gender: vine.enum(['male', 'female', 'other'] as const).optional(),
    profilePicture: vine.string().trim().optional(),
  })
)
