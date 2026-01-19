import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import hash from '@adonisjs/core/services/hash'

export default class extends BaseSeeder {
  async run() {
    const users = [
      {
        name: 'Anu',
        username: 'anu123',
        email: 'anu@gmail.com',
        password: await hash.make('anu1234'),
        gender: 'female' as const,
        bio: 'Hello, I am Anu!',
        profilePicture: null as string | null,
      },
      {
        name: 'Shreya',
        username: 'shreya123',
        email: 'shreya@gmail.com',
        password: await hash.make('shreya1234'),
        gender: 'female' as const,
        bio: 'Hello, I am Shreya!',
        profilePicture: null as string | null,
      },
      {
        name: 'Vidhi',
        username: 'vidhi123',
        email: 'vidhi@gmail.com',
        password: await hash.make('vidhi1234'),
        gender: 'female' as const,
        bio: 'Hello, I am Vidhi!',
        profilePicture: null as string | null,
      },
      {
        name: 'Mayank',
        username: 'mayank123',
        email: 'mayank@gmail.com',
        password: await hash.make('mayank1234'),
        gender: 'male' as const,
        bio: 'Hello, I am Mayank!',
        profilePicture: null as string | null,
      },
      {
        name: 'Vivek',
        username: 'vivek123',
        email: 'vivek@gmail.com',
        password: await hash.make('vivek1234'),
        gender: 'male' as const,
        bio: 'Hello, I am Vivek!',
        profilePicture: null as string | null,
      },
      {
        name: 'Anil',
        username: 'anil123',
        email: 'anil@gmail.com',
        password: await hash.make('anil1234'),
        gender: 'male' as const,
        bio: 'Hello, I am Anil!',
        profilePicture: null as string | null,
      },
    ]

    // Idempotent seeding: running multiple times won't throw duplicate email/username errors
    for (const user of users) {
      await User.firstOrCreate({ email: user.email }, user)
    }
  }
}
