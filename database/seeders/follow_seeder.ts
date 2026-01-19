import { BaseSeeder } from '@adonisjs/lucid/seeders'

import Follow from '#models/follow'
import User from '#models/user'
 
export default class extends BaseSeeder {
  public async run() {
    const users = await User.query().orderBy('id', 'asc')
    if (users.length < 2) return

    const u1 = users[0]
    const u2 = users[1]
    const u3 = users[Math.min(2, users.length - 1)]

    // u2,u3 follows u1 
    await Follow.firstOrCreate({ userId: u1.id, followerId: u2.id }, {})
    await Follow.firstOrCreate({ userId: u1.id, followerId: u3.id }, {})

    // u1 follows u2
    await Follow.firstOrCreate({ userId: u2.id, followerId: u1.id }, {})
  }
}

