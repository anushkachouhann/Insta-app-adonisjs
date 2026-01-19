import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Post from './post.js'
import Like from './like.js'
import Comment from './comment.js'
import Share from './share.js'

export default class User extends BaseModel {
  public static accessTokens = DbAccessTokensProvider.forModel(User)

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string | null

  @column()
  declare email: string

  @column()
  declare username: string

  @column()
  declare bio: string

  @column()
  declare gender: 'male' | 'female' | 'other' | null

  @column({ columnName: 'profile_picture' })
  declare profilePicture: string | null

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime({ serializeAs: null })
  declare deletedAt: DateTime | null

  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  @hasMany(() => Like)
  declare likes: HasMany<typeof Like>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @hasMany(() => Share)
  declare shares: HasMany<typeof Share>
}
