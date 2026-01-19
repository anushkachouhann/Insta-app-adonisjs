import type { HttpContext } from '@adonisjs/core/http'

import { FollowService } from '#services/follow_service'
import { UserService } from '#services/user_service'
import { parseId } from '#utils/params'
import { handleError, ok } from '#utils/response'

export default class FollowsController {
  private followService = new FollowService()
  private userService = new UserService()
 
  public async followers(ctx: HttpContext) {
    try {
      const userId = parseId(ctx.params.userId, 'userId')
      await this.userService.getUserById(userId)

      const followerIds = await this.followService.getFollowerIds(userId)
      const followers = await this.followService.getUsersByIdsOrdered(followerIds)

      return ok(ctx, {
        data: {
          userId,
          total: followerIds.length,
          followers,
        },
      })
    } catch (error) {
      return handleError(ctx, error)
    }
  }
 
  public async following(ctx: HttpContext) {
    try {
      const userId = parseId(ctx.params.userId, 'userId')
      await this.userService.getUserById(userId)

      const followingIds = await this.followService.getFollowingIds(userId)
      const following = await this.followService.getUsersByIdsOrdered(followingIds)

      return ok(ctx, {
        data: {
          userId,
          total: followingIds.length,
          following,
        },
      })
    } catch (error) {
      return handleError(ctx, error)
    }
  }
}

