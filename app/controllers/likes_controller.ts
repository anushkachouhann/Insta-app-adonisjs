import type { HttpContext } from '@adonisjs/core/http'
import { LikeService } from '#services/like_service'

export default class LikesController {
  private likeService = new LikeService()

  public async like({ request, response }: HttpContext) {
    try {
      const { userId, postId } = request.only(['userId', 'postId'])

      const result = await this.likeService.likePost(userId, postId)

      return response.status(201).json({
        likes_count: result.likesCount,
        like: result.like,  
      })
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }

  public async unlike({ request, response }: HttpContext) {
    try {
      const { userId, postId } = request.only(['userId', 'postId'])
      const result = await this.likeService.unlikePost(userId, postId)
      return response.json(result)
    } catch (error: any) {
      return response.status(400).json({ error: error.message })
    }
  }

  public async getPostLikes({ params, response }: HttpContext) {
    try {
      const likes = await this.likeService.getLikesByPostId(params.postId)
      return response.json(likes)
    } catch (error: any) {
      return response.status(500).json({ error: error.message })
    }
  }

  public async checkLike({ params, request, response }: HttpContext) {
    try {
      const { userId } = request.only(['userId'])
      const isLiked = await this.likeService.checkIfLiked(userId, params.postId)
      return response.json({ isLiked })
    } catch (error: any) {
      return response.status(500).json({ error: error.message })
    }
  }
}
