import type { HttpContext } from '@adonisjs/core/http'
import { LikeService } from '#services/like_service'
import { handleError, created, ok } from '#utils/response'
import { parseId } from '#utils/params'
import { likeToggleValidator } from '#validators/likes/like_toggle_validator'

export default class LikesController {
  private likeService = new LikeService()

  public async like(ctx: HttpContext) {
    try {
      const payload = await ctx.request.validateUsing(likeToggleValidator)
      const result = await this.likeService.likePost(payload.userId, payload.postId)

      return created(ctx, {
        messageKey: 'CREATED',
        data: {
          likes_count: result.likesCount,
          like: result.like,
        },
      })
    } catch (error) {
      return handleError(ctx, error)
    }
  }

  public async unlike(ctx: HttpContext) {
    try {
      const payload = await ctx.request.validateUsing(likeToggleValidator)
      const result = await this.likeService.unlikePost(payload.userId, payload.postId)
      return ok(ctx, { messageKey: 'DELETED', data: result })
    } catch (error) {
      return handleError(ctx, error)
    }
  }

  public async getPostLikes(ctx: HttpContext) {
    try {
      const postId = parseId(ctx.params.postId, 'postId')
      const likes = await this.likeService.getLikesByPostId(postId)
      return ok(ctx, { data: likes })
    } catch (error) {
      return handleError(ctx, error)
    }
  }

  public async checkLike(ctx: HttpContext) {
    try {
      const userId = parseId(ctx.request.input('userId'), 'userId')
      const postId = parseId(ctx.params.postId, 'postId')
      const isLiked = await this.likeService.checkIfLiked(userId, postId)
      return ok(ctx, { data: { isLiked } })
    } catch (error) {
      return handleError(ctx, error)
    }
  }
}
