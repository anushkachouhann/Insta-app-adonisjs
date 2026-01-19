import Post from "#models/post";
import User from "#models/user";

export class PostService {
  public async getAllPosts(){
    return await Post.query().preload('user').orderBy('created_at', 'desc');
  }

  public async getPostById(id: number){
    const post = await Post.query()
      .where('id', id)
      .preload('user')
      .preload('likes', (query) => {
        query.preload('user');
      })
      .preload('comments', (query) => {
        query.preload('user').preload('replies');
      })
      .first();
    
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }

  public async getPostsByUserId(userId: number){
    return await Post.query()
      .where('user_id', userId)
      .preload('user')
      .orderBy('created_at', 'desc');
  }

  public async createPost(postData: {
    userId: number;
    caption?: string | null;
    mediaUrl: string;
    postType: 'post' | 'reel';
  }){
    const user = await User.find(postData.userId);
    if (!user) {
      throw new Error('User not found');
    }

    return await Post.create({
      userId: postData.userId,
      caption: postData.caption || null,
      mediaUrl: postData.mediaUrl,
      postType: postData.postType,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
    });
  }

  public async updatePost(id: number, postData: {
    caption?: string | null;
    mediaUrl?: string;
  }){
    const post = await Post.find(id);
    if (!post) {
      throw new Error('Post not found');
    }

    post.merge(postData);
    await post.save();
    return post;
  }

  public async deletePost(id: number){
    const post = await Post.find(id);
    if (!post) {
      throw new Error('Post not found');
    }
    await post.delete();
    return { message: 'Post deleted successfully' };
  } 

  public async incrementLikesCount(postId: number){
    const post = await Post.find(postId);
    if (post) {
      post.likesCount += 1;
      await post.save();
    }
  }

  public async decrementLikesCount(postId: number){
    const post = await Post.find(postId);
    if (post) {
      post.likesCount = Math.max(0, post.likesCount - 1);
      await post.save();
    }
  }

  public async incrementCommentsCount(postId: number){
    const post = await Post.find(postId);
    if (post) {
      post.commentsCount += 1;
      await post.save();
    }
  }

  public async incrementSharesCount(postId: number){
    const post = await Post.find(postId);
    if (post) {
      post.sharesCount += 1;
      await post.save();
    }
  }
}