import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { MovieSyncService } from '#services/movie_sync_service'

/**
 * Premier remplissage du catalogue. La même synchronisation tourne ensuite
 * automatiquement (voir start/scheduler.ts) ou à la main avec `movies:sync`.
 */
export default class extends BaseSeeder {
  async run() {
    await new MovieSyncService().sync()
  }
}
