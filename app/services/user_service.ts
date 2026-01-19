import hash from '@adonisjs/core/services/hash'
import { ApiException } from '#exceptions/api_exception'
import User from '#models/user'

export class UserService {
  public async getAllUsers() {
    return await User.all()
  }

  public async getUserById(id: number) {
    const user = await User.find(id)
    if (!user) {
      throw new ApiException('USER_NOT_FOUND', 404, 'E_USER_NOT_FOUND')
    }
    return user
  }

  public async createUser(userData: {
    name?: string | null
    email: string
    username: string
    password: string
    bio?: string
    gender?: 'male' | 'female' | 'other' | null
    profilePicture?: string | null
  }) {
    const hashedPassword = await hash.make(userData.password)
    return await User.create({
      ...userData,
      name: userData.name ?? null,
      password: hashedPassword,
      profilePicture: userData.profilePicture || undefined,
      bio: userData.bio || undefined,
    })
  }

  public async updateUser(
    id: number,
    userData: {
      name?: string | null
      email?: string
      username?: string
      password?: string
      bio?: string
      gender?: 'male' | 'female' | 'other' | null
      profilePicture?: string | null
    }
  ) {
    const user = await User.find(id)
    if (!user) {
      throw new ApiException('USER_NOT_FOUND', 404, 'E_USER_NOT_FOUND')
    }

    if (userData.password) {
      userData.password = await hash.make(userData.password)
    }

    user.merge(userData)
    await user.save()
    return user
  }

  public async deleteUser(id: number) {
    const user = await User.find(id)
    if (!user) {
      throw new ApiException('USER_NOT_FOUND', 404, 'E_USER_NOT_FOUND')
    }
    await user.delete()
    return { message: 'User deleted successfully' }
  }
}
