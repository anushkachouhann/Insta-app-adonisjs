import Comment from '#models/comment'
import Post from '#models/post'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const users = await User.all()
    const posts = await Post.all()
    if (users.length === 0 || posts.length === 0) return

    for (const post of posts) {
      const author = users[0]
      const commenter = users[Math.min(1, users.length - 1)]

      // Idempotent: don't keep inserting same demo comments on every run
      const main = await Comment.firstOrCreate(
        {
          userId: author.id,
          postId: post.id,
          parentId: null,
          content: `Nice post #${post.id}`,
        },
        {
          userId: author.id,
          postId: post.id,
          content: `Nice post #${post.id}`,
          parentId: null,
        }
      )

      await Comment.firstOrCreate(
        {
          userId: commenter.id,
          postId: post.id,
          parentId: main.id,
          content: `Thanks! (reply to ${main.id})`,
        },
        {
          userId: commenter.id,
          postId: post.id,
          content: `Thanks! (reply to ${main.id})`,
          parentId: main.id,
        }
      )

      const res = await Comment.query()
        .where('post_id', post.id)
        .whereNull('parent_id')
        .count('* as total')
      post.commentsCount = Number(res[0].$extras.total || 0)
      await post.save()
    }
  }
}
