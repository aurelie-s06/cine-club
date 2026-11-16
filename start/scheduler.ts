/*
|--------------------------------------------------------------------------
| Scheduler
|--------------------------------------------------------------------------
|
| Tâches planifiées. Le planning est enregistré en base au démarrage du
| serveur web ; c'est le worker (node ace queue:work) qui l'exécute.
|
*/

import DispatchReleaseAlerts from '#jobs/dispatch_release_alerts'
import { RELEASE_TIMEZONE } from '#models/movie'

/**
 * Alertes de sortie : tous les matins à 8 h, heure de Paris.
 * L'identifiant fixe évite de créer un nouveau planning à chaque démarrage.
 */
await DispatchReleaseAlerts.schedule({})
  .id('release-alerts')
  .cron('0 8 * * *')
  .timezone(RELEASE_TIMEZONE)
  .run()
