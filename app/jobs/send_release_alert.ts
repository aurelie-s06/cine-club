import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import logger from '@adonisjs/core/services/logger'
import mail from '@adonisjs/mail/services/main'
import { DateTime } from 'luxon'
import MovieFollow from '#models/movie_follow'
import ReleaseAlertNotification from '#mails/release_alert_notification'

interface SendReleaseAlertPayload {
  followId: number
}

/**
 * Envoie UN email d'alerte de sortie.
 *
 * Un job par destinataire : si un envoi échoue, seul celui-ci est retenté,
 * sans renvoyer l'email à ceux qui l'ont déjà reçu.
 */
export default class SendReleaseAlert extends Job<SendReleaseAlertPayload> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  }

  async execute() {
    /**
     * La charge utile ne contient qu'un identifiant : on relit la base au
     * moment de l'exécution (le suivi a pu être supprimé entre-temps).
     */
    const follow = await MovieFollow.query()
      .where('id', this.payload.followId)
      .preload('user')
      .preload('movie')
      .first()

    // Suivi supprimé, ou alerte déjà envoyée : rien à faire
    if (!follow || follow.notifiedAt) {
      return
    }

    // On est dans le worker, pas dans une requête HTTP : send() est le bon choix
    await mail.send(new ReleaseAlertNotification(follow.user, follow.movie))

    follow.notifiedAt = DateTime.now()
    await follow.save()
  }

  async failed(error: Error) {
    logger.error(
      { followId: this.payload.followId },
      `Alerte de sortie non envoyée : ${error.message}`
    )
  }
}
