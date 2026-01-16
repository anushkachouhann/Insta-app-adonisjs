import Share from "#models/share";
import Post from "#models/post";
import User from "#models/user";
import { PostService } from "./post_service.js";

export class ShareService {
  private postService = new PostService();

  public async sharePost(userId: number, postId: number){
    const user = await User.find(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const post = await Post.find(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const existingShare = await Share.query()
      .where('user_id', userId)
      .where('post_id', postId)
      .first();

    if (existingShare) {
      throw new Error('Post already shared by this user');
    }

    const share = await Share.create({
      userId: userId,
      postId: postId,
    });

    await this.postService.incrementSharesCount(postId);
    return share;
  }

  public async getSharesByPostId(postId: number){
    return await Share.query()
      .where('post_id', postId)
      .preload('user')
      .orderBy('created_at', 'desc');
  }

  public async getShareCount(postId: number){
    const count = await Share.query()
      .where('post_id', postId)
      .count('* as total');
    
    return count[0].$extras.total;
  }
}
