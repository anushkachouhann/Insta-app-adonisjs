import Comment from '#models/comment'
import Like from '#models/like'

export type LikesReportRow = {
  id: number
  userId: number
  username: string
  postId: number
  postType: string
  caption: string | null
  createdAt: string
}

export type CommentsReportRow = {
  id: number
  userId: number
  username: string
  postId: number
  parentId: number | null
  content: string
  createdAt: string
}

export class ReportService {
  public async likesReport(): Promise<LikesReportRow[]> {
    const likes = await Like.query().preload('user').preload('post').orderBy('created_at', 'desc')

    return likes.map((like) => ({
      id: like.id,
      userId: like.userId,
      username: like.user?.username ?? '',
      postId: like.postId,
      postType: like.post?.postType ?? '',
      caption: like.post?.caption ?? null,
      createdAt: like.createdAt?.toISO?.() ?? String(like.createdAt),
    }))
  }

  public async commentsReport(): Promise<CommentsReportRow[]> {
    const comments = await Comment.query()
      .preload('user')
      .preload('post')
      .orderBy('created_at', 'desc')

    return comments.map((comment) => ({
      id: comment.id,
      userId: comment.userId,
      username: comment.user?.username ?? '',
      postId: comment.postId,
      parentId: comment.parentId,
      content: comment.content,
      createdAt: comment.createdAt?.toISO?.() ?? String(comment.createdAt),
    }))
  }
}
