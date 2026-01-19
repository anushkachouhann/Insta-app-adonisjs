import type { HttpContext } from '@adonisjs/core/http'
import { ShareService } from '#services/share_service'
import { handleError, created, ok } from '#utils/response'
import { parseId } from '#utils/params'
import { createShareValidator } from '#validators/shares/create_share_validator'

export default class SharesController {
  private shareService = new ShareService()

  public async share(ctx: HttpContext) {
    try {
      const payload = await ctx.request.validateUsing(createShareValidator)
      const share = await this.shareService.sharePost(payload.userId, payload.postId)
      return created(ctx, { messageKey: 'CREATED', data: share })
    } catch (error) {
      return handleError(ctx, error)
    }
  }

  public async getPostShares(ctx: HttpContext) {
    try {
      const postId = parseId(ctx.params.postId, 'postId')
      const shares = await this.shareService.getSharesByPostId(postId)
      return ok(ctx, { data: shares })
    } catch (error) {
      return handleError(ctx, error)
    }
  }

  public async getShareCount(ctx: HttpContext) {
    try {
      const postId = parseId(ctx.params.postId, 'postId')
      const count = await this.shareService.getShareCount(postId)
      return ok(ctx, { data: { count } })
    } catch (error) {
      return handleError(ctx, error)
    }
  }
}
