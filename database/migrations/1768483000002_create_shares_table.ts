import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shares'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('post_id').unsigned().references('id').inTable('posts').onDelete('CASCADE')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      
      table.unique(['user_id', 'post_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
