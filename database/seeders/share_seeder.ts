import Post from '#models/post'
import Share from '#models/share'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const users = await User.all()
    const posts = await Post.all()
    if (users.length === 0 || posts.length === 0) return

    for (const post of posts) {
      const user = users[Math.min(2, users.length - 1)]
      await Share.firstOrCreate({ userId: user.id, postId: post.id }, {})

      const res = await Share.query().where('post_id', post.id).count('* as total')
      post.sharesCount = Number(res[0].$extras.total || 0)
      await post.save()
    }
  }
}
