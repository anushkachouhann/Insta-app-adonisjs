import vine from '@vinejs/vine'

export const likeToggleValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    postId: vine.number(),
  })
)
