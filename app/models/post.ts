import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Like from './like.js'
import Comment from './comment.js'
import Share from './share.js'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column()
  declare caption: string | null

  @column({ columnName: 'media_url' })
  declare mediaUrl: string

  @column({ columnName: 'post_type' })
  declare postType: 'post' | 'reel'

  @column({ columnName: 'likes_count' })
  declare likesCount: number

  @column({ columnName: 'comments_count' })
  declare commentsCount: number

  @column({ columnName: 'shares_count' })
  declare sharesCount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Like)
  declare likes: HasMany<typeof Like>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @hasMany(() => Share)
  declare shares: HasMany<typeof Share>
}