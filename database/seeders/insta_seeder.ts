import { BaseSeeder } from '@adonisjs/lucid/seeders'

import UserSeeder from './user_seeder.js'
import PostSeeder from './post_seeder.js'
import LikeSeeder from './like_seeder.js'
import CommentSeeder from './comment_seeder.js'
import ShareSeeder from './share_seeder.js'

/** 
 *   node ace db:seed --files "database/seeders/insta_seeder.ts"
 */
export default class InstaSeeder extends BaseSeeder {
  public async run() {
    await new UserSeeder(this.client).run()
    await new PostSeeder(this.client).run()
    await new LikeSeeder(this.client).run()
    await new CommentSeeder(this.client).run()
    await new ShareSeeder(this.client).run()
  }
}

