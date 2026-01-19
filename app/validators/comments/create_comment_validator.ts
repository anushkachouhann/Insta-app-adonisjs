import vine from '@vinejs/vine'

export const createCommentValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    postId: vine.number(),
    content: vine.string().trim().minLength(1).maxLength(2000),
    parentId: vine.number().optional(),
  })
)
