import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import SyncMovies from '#jobs/sync_movies'
import { MovieSyncService } from '#services/movie_sync_service'

/**
 * Lance à la main la mise à jour du catalogue, sans attendre le planificateur.
 */
export default class SyncMoviesCommand extends BaseCommand {
  static commandName = 'movies:sync'
  static description = 'Importe les nouveaux films et met à jour le catalogue depuis TMDB'

  static options: CommandOptions = {
    startApp: true,
  }

  @flags.boolean({ description: 'Synchroniser tout de suite, sans passer par la file' })
  declare sync: boolean

  async run() {
    if (this.sync) {
      const { created, updated } = await new MovieSyncService().sync()
      this.logger.success(`${created} film(s) ajouté(s), ${updated} mis à jour`)
      return
    }

    await SyncMovies.dispatch({})
    this.logger.success('Synchronisation déposée dans la file')
  }
}
