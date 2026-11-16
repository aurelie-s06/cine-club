import { DateTime } from 'luxon'
import Movie, { RELEASE_TIMEZONE } from '#models/movie'
import MovieFollow from '#models/movie_follow'
import SendReleaseAlert from '#jobs/send_release_alert'

/**
 * Nombre de jours de rattrapage : si le worker était arrêté le jour J, les
 * alertes partent quand même (en retard) au redémarrage, mais on n'annonce
 * pas « sort aujourd'hui » un film sorti il y a un mois.
 */
const CATCH_UP_DAYS = 3

/**
 * Le métier des alertes de sortie, sans requête ni réponse : appelable
 * depuis la tâche planifiée comme depuis la commande Ace.
 */
export class ReleaseAlertService {
  /**
   * Repère les films qui sortent aujourd'hui et dépose un job d'envoi par
   * utilisateur qui les suit. Retourne le nombre d'emails mis en file.
   */
  async dispatchDueAlerts(): Promise<number> {
    const today = Movie.today()
    const oldest = DateTime.fromISO(today, { zone: RELEASE_TIMEZONE })
      .minus({ days: CATCH_UP_DAYS })
      .toISODate()!

    const follows = await MovieFollow.query()
      .whereNull('notifiedAt')
      .whereHas('movie', (movie) => {
        movie.whereBetween('releaseDate', [oldest, today])
      })
      .select('id')

    for (const follow of follows) {
      /**
       * dedup : si la préparation est lancée deux fois (planificateur et
       * commande manuelle), le même suivi n'est mis en file qu'une fois.
       */
      await SendReleaseAlert.dispatch({ followId: follow.id }).dedup({
        id: `release-alert-${follow.id}`,
        ttl: '1h',
      })
    }

    return follows.length
  }
}
