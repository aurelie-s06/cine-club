import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import logger from '@adonisjs/core/services/logger'
import { ReleaseAlertService } from '#services/release_alert_service'

/**
 * Tâche planifiée (voir start/scheduler.ts) : prépare les alertes du jour.
 * Le métier vit dans ReleaseAlertService, partagé avec la commande Ace.
 */
export default class DispatchReleaseAlerts extends Job<Record<string, never>> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  }

  async execute() {
    const count = await new ReleaseAlertService().dispatchDueAlerts()
    logger.info(`Alertes de sortie : ${count} email(s) mis en file`)
  }

  async failed(error: Error) {
    logger.error(`Échec de la préparation des alertes de sortie : ${error.message}`)
  }
}
