import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import logger from '@adonisjs/core/services/logger'
import { MovieSyncService } from '#services/movie_sync_service'

/**
 * Tâche planifiée (voir start/scheduler.ts) : met le catalogue à jour depuis
 * TMDB. Le métier vit dans MovieSyncService, partagé avec la commande Ace.
 */
export default class SyncMovies extends Job<Record<string, never>> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  }

  async execute() {
    const { created, updated } = await new MovieSyncService().sync()
    logger.info(`Synchro TMDB : ${created} film(s) ajouté(s), ${updated} mis à jour`)
  }

  async failed(error: Error) {
    logger.error(`Échec de la synchro TMDB : ${error.message}`)
  }
}
