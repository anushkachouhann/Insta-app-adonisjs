import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'follows'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
 
      table.integer('user_id').notNullable()
      table.integer('follower_id').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['user_id', 'follower_id'])
      table.index(['user_id'])
      table.index(['follower_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

