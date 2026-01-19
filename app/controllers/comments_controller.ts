import type { HttpContext } from '@adonisjs/core/http'
import { CommentService } from '#services/comment_service'
import { handleError, created, ok, noContent } from '#utils/response'
import { parseId } from '#utils/params'
import { createCommentValidator } from '#validators/comments/create_comment_validator'
import { updateCommentValidator } from '#validators/comments/update_comment_validator'

export default class CommentsController {
  private commentService = new CommentService()

  public async create(ctx: HttpContext) {
    try {
      const payload = await ctx.request.validateUsing(createCommentValidator)
      const comment = await this.commentService.createComment(payload)
      return created(ctx, { messageKey: 'CREATED', data: comment })
    } catch (error) {
      return handleError(ctx, error)
    }
  }

  public async getPostComments(ctx: HttpContext) {
    try {
      const postId = parseId(ctx.params.postId, 'postId')
      const comments = await this.commentService.getCommentsByPostId(postId)
      return ok(ctx, { data: comments })
    } catch (error) {
      return handleError(ctx, error)
    }
  }

  public async show(ctx: HttpContext) {
    try {
      const id = parseId(ctx.params.id)
      const comment = await this.commentService.getCommentById(id)
      return ok(ctx, { data: comment })
    } catch (error) {
      return handleError(ctx, error)
    }
  }

  public async update(ctx: HttpContext) {
    try {
      const id = parseId(ctx.params.id)
      const payload = await ctx.request.validateUsing(updateCommentValidator)
      const updatedComment = await this.commentService.updateComment(id, payload.content)
      return ok(ctx, { messageKey: 'UPDATED', data: updatedComment })
    } catch (error) {
      return handleError(ctx, error)
    }
  }

  public async destroy(ctx: HttpContext) {
    try {
      const id = parseId(ctx.params.id)
      await this.commentService.deleteComment(id)
      return noContent(ctx, { messageKey: 'DELETED' })
    } catch (error) {
      return handleError(ctx, error)
    }
  }
}
