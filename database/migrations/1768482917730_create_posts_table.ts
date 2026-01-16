import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.text('caption').nullable()
      table.string('media_url').notNullable()
      table.enum('post_type', ['post', 'reel']).defaultTo('post')
      table.integer('likes_count').defaultTo(0)
      table.integer('comments_count').defaultTo(0)
      table.integer('shares_count').defaultTo(0)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}