import Like from "#models/like";
import Post from "#models/post";
import User from "#models/user";
import { PostService } from "./post_service.js";

export class LikeService {
  private postService = new PostService();

  public async likePost(userId: number, postId: number){
    const user = await User.find(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const post = await Post.find(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const existingLike = await Like.query()
      .where('user_id', userId)
      .where('post_id', postId)
      .first();

    if (existingLike) {
      throw new Error('Post already liked');
    }

    const like = await Like.create({
      userId: userId,
      postId: postId,
    });

    await this.postService.incrementLikesCount(postId);
    await post.refresh();
    return {like, likesCount: post.likesCount};
  }

  public async unlikePost(userId: number, postId: number){
    const like = await Like.query()
      .where('user_id', userId)
      .where('post_id', postId)
      .first();

    if (!like) {
      throw new Error('Like not found');
    }

    await like.delete();
    await this.postService.decrementLikesCount(postId);
    return { message: 'Post unliked successfully' };
  }

  public async getLikesByPostId(postId: number){
    return await Like.query()
      .where('post_id', postId)
      .preload('user')
      .orderBy('created_at', 'desc');
  }

  public async checkIfLiked(userId: number, postId: number){
    const like = await Like.query()
      .where('user_id', userId)
      .where('post_id', postId)
      .first();
    
    return !!like;
  }
}
