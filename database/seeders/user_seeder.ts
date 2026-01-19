import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await User.createMany([
      {
        name: 'Anu',
        username: 'anu123',
        email: 'anu@gmail.com',
        password: 'anu1234',
        gender: 'female',
        bio: 'Hello, I am Anu!',
        profilePicture: null,
      },
      {
        name: 'Shreya',
        username: 'shreya123',
        email: 'shreya@gmail.com',
        password: 'shreya1234',
        gender: 'female',
        bio: 'Hello, I am Shreya!',
        profilePicture: null,
      },
      {
        name: 'Vidhi',
        username: 'vidhi123',
        email: 'vidhi@gmail.com',
        password: 'vidhi1234',
        gender: 'female',
        bio: 'Hello, I am Vidhi!',
        profilePicture: null,
      },
      {
        name: 'Mayank',
        username: 'mayank123',
        email: 'mayank@gmail.com',
        password: 'mayank1234',
        gender: 'male',
        bio: 'Hello, I am Mayank!',
        profilePicture: null,
      },
      {
        name: 'Vivek',
        username: 'vivek123',
        email: 'vivek@gmail.com',
        password: 'vivek1234',
        gender: 'male',
        bio: 'Hello, I am Vivek!',
        profilePicture: null,
      },
      {
        name: 'Anil',
        username: 'anil123',
        email: 'anil@gmail.com',
        password: 'anil1234',
        gender: 'male',
        bio: 'Hello, I am Anil!',
        profilePicture: null,
      },
    ])
  }
}
