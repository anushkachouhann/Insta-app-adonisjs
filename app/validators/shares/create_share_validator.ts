import vine from '@vinejs/vine'

export const createShareValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    postId: vine.number(),
  })
)
