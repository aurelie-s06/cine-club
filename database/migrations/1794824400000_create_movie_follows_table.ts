import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Un utilisateur suit un film pas encore sorti pour être prévenu par email
 * le jour de sa sortie.
 */
export default class extends BaseSchema {
  protected tableName = 'movie_follows'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('movie_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('movies')
        .onDelete('CASCADE')

      /**
       * Date d'envoi de l'alerte. Tant qu'elle est nulle, l'alerte reste à
       * envoyer : c'est ce qui rend l'envoi idempotent (jamais deux emails).
       */
      table.timestamp('notified_at').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      // Un même film ne se suit qu'une fois
      table.unique(['user_id', 'movie_id'])
      table.index(['notified_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
