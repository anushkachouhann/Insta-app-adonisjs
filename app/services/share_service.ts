import { ApiException } from '#exceptions/api_exception'
import Post from '#models/post'
import Share from '#models/share'
import User from '#models/user'
import { PostService } from './post_service.js'

export class ShareService {
  private postService = new PostService()

  public async sharePost(userId: number, postId: number) {
    const user = await User.find(userId)
    if (!user) {
      throw new ApiException('USER_NOT_FOUND', 404, 'E_USER_NOT_FOUND')
    }

    const post = await Post.find(postId)
    if (!post) {
      throw new ApiException('POST_NOT_FOUND', 404, 'E_POST_NOT_FOUND')
    }

    const existingShare = await Share.query()
      .where('user_id', userId)
      .where('post_id', postId)
      .first()

    if (existingShare) {
      throw new ApiException('POST_ALREADY_SHARED', 409, 'E_POST_ALREADY_SHARED')
    }

    const share = await Share.create({
      userId: userId,
      postId: postId,
    })

    await this.postService.incrementSharesCount(postId)
    return share
  }

  public async getSharesByPostId(postId: number) {
    return await Share.query()
      .where('post_id', postId)
      .preload('user')
      .orderBy('created_at', 'desc')
  }

  public async getShareCount(postId: number) {
    const count = await Share.query().where('post_id', postId).count('* as total')

    return count[0].$extras.total
  }
}
