/*
|--------------------------------------------------------------------------
| Scheduler
|--------------------------------------------------------------------------
|
| Tâches planifiées. Le planning est enregistré en base au démarrage du
| serveur web ; c'est le worker (node ace queue:work) qui l'exécute.
|
*/

import SyncMovies from '#jobs/sync_movies'
import DispatchReleaseAlerts from '#jobs/dispatch_release_alerts'
import { RELEASE_TIMEZONE } from '#models/movie'

/**
 * Mise à jour du catalogue depuis TMDB toutes les 6 heures (0 h, 6 h, 12 h,
 * 18 h). Le passage de 6 h précède les alertes de 8 h, qui s'appuient donc
 * sur des dates de sortie à jour.
 */
await SyncMovies.schedule({}).id('movies-sync').cron('0 */6 * * *').timezone(RELEASE_TIMEZONE).run()

/**
 * Alertes de sortie : tous les matins à 8 h, heure de Paris.
 * L'identifiant fixe évite de créer un nouveau planning à chaque démarrage.
 */
await DispatchReleaseAlerts.schedule({})
  .id('release-alerts')
  .cron('0 8 * * *')
  .timezone(RELEASE_TIMEZONE)
  .run()
