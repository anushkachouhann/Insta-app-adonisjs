import Like from '#models/like'
import Post from '#models/post'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const users = await User.all()
    const posts = await Post.all()
    if (users.length === 0 || posts.length === 0) return

    for (const post of posts) {
      for (const user of users.slice(0, Math.min(3, users.length))) {
        // Idempotent: likes table has unique(user_id, post_id)
        await Like.firstOrCreate({ userId: user.id, postId: post.id }, {})
      }
    }
 
    for (const post of posts) {
      const res = await Like.query().where('post_id', post.id).count('* as total')
      const total = Number(res[0].$extras.total || 0)
      post.likesCount = total
      await post.save()
    }
  }
}
