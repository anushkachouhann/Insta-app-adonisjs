import vine from '@vinejs/vine'

export const updatePostValidator = vine.compile(
  vine.object({
    caption: vine.string().trim().maxLength(2000).optional(),
    mediaUrl: vine.string().trim().optional(),
  })
)
