import vine from '@vinejs/vine'

export const createPostValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    caption: vine.string().trim().maxLength(2000).optional(),
    mediaUrl: vine.string().trim(),
    postType: vine.enum(['post', 'reel'] as const),
  })
)
