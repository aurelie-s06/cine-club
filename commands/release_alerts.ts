import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import DispatchReleaseAlerts from '#jobs/dispatch_release_alerts'
import { ReleaseAlertService } from '#services/release_alert_service'

/**
 * Déclenche à la main la préparation des alertes de sortie, sans attendre
 * le planificateur de 8 h. Utile pour tester ou rejouer un envoi raté.
 *
 * Dans les deux cas, les emails eux-mêmes sont envoyés par le worker
 * (node ace queue:work).
 */
export default class ReleaseAlertsCommand extends BaseCommand {
  static commandName = 'movies:release-alerts'
  static description = "Met en file les emails d'alerte des films qui sortent aujourd'hui"

  static options: CommandOptions = {
    startApp: true,
  }

  @flags.boolean({ description: 'Préparer les envois tout de suite, sans passer par la file' })
  declare sync: boolean

  async run() {
    if (this.sync) {
      const count = await new ReleaseAlertService().dispatchDueAlerts()
      this.logger.success(`${count} email(s) d'alerte mis en file`)
      return
    }

    await DispatchReleaseAlerts.dispatch({})
    this.logger.success('Préparation des alertes déposée dans la file')
  }
}
