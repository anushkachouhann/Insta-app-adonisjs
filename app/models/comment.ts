import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Post from './post.js'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column({ columnName: 'post_id' })
  declare postId: number

  @column({ columnName: 'parent_id' })
  declare parentId: number | null

  @column()
  declare content: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>

  @belongsTo(() => Comment, {
    foreignKey: 'parentId',
  })
  declare parent: BelongsTo<typeof Comment>

  @hasMany(() => Comment, {
    foreignKey: 'parentId',
  })
  declare replies: HasMany<typeof Comment>
}
