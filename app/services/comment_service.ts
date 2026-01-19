import Comment from "#models/comment";
import Post from "#models/post";
import User from "#models/user";
import { PostService } from "./post_service.js";

export class CommentService {
  private postService = new PostService();

  public async createComment(commentData: {
    userId: number;
    postId: number;
    content: string;
    parentId?: number | null;
  }){
    const user = await User.find(commentData.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const post = await Post.find(commentData.postId);
    if (!post) {
      throw new Error('Post not found');
    }

    if (commentData.parentId) {
      const parentComment = await Comment.find(commentData.parentId);
      if (!parentComment) {
        throw new Error('Parent comment not found');
      }
    }

    const comment = await Comment.create({
      userId: commentData.userId,
      postId: commentData.postId,
      content: commentData.content,
      parentId: commentData.parentId || null,
    });

    if (!commentData.parentId) {
      await this.postService.incrementCommentsCount(commentData.postId);
    }

    return comment;
  }

  public async getCommentsByPostId(postId: number){
    return await Comment.query()
      .where('post_id', postId)
      .whereNull('parent_id')
      .preload('user')
      .preload('replies', (query) => {
        query.preload('user');
      })
      .orderBy('created_at', 'desc');
  }

  public async getCommentById(id: number){
    const comment = await Comment.query()
      .where('id', id)
      .preload('user')
      .preload('post')
      .preload('replies', (query) => {
        query.preload('user');
      })
      .first();

    if (!comment) {
      throw new Error('Comment not found');
    }
    return comment;
  }

  public async updateComment(id: number, content: string){
    const comment = await Comment.find(id);
    if (!comment) {
      throw new Error('Comment not found');
    }

    comment.content = content;
    await comment.save();
    return comment;
  }

  public async deleteComment(id: number){
    const comment = await Comment.find(id);
    if (!comment) {
      throw new Error('Comment not found');
    }

    const postId = comment.postId;
    const isMainComment = !comment.parentId;

    await comment.delete();

    if (isMainComment) {
      const post = await Post.find(postId);
      if (post) {
        post.commentsCount = Math.max(0, post.commentsCount - 1);
        await post.save();
      }
    }

    return { message: 'Comment deleted successfully' };
  }
}
