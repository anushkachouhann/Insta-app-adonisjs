import Post from '#models/post'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const users = await User.all()
    if (users.length === 0) return

    const posts = [
      {
        userId: users[0].id,
        caption: 'First post!',
        mediaUrl: 'https://example.com/media/1.jpg',
        postType: 'post' as const,
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
      },
      {
        userId: users[Math.min(1, users.length - 1)].id,
        caption: 'My reel',
        mediaUrl: 'https://example.com/media/2.mp4',
        postType: 'reel' as const,
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
      },
      {
        userId: users[Math.min(2, users.length - 1)].id,
        caption: 'Hello world',
        mediaUrl: 'https://example.com/media/3.jpg',
        postType: 'post' as const,
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
      },
    ]

    // Idempotent: avoid inserting duplicates if seeder runs again
    for (const post of posts) {
      await Post.firstOrCreate({ userId: post.userId, mediaUrl: post.mediaUrl }, post)
    }
  }
}
