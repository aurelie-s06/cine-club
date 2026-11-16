import env from '#start/env'
import { BaseMail } from '@adonisjs/mail'
import type Movie from '#models/movie'
import type User from '#models/user'

/**
 * Email envoyé le jour de la sortie d'un film suivi.
 */
export default class ReleaseAlertNotification extends BaseMail {
  constructor(
    private user: User,
    private movie: Movie
  ) {
    super()
  }

  prepare() {
    const movieUrl = new URL(`/movies/${this.movie.id}`, env.get('APP_URL')).toString()

    this.message
      .to(this.user.email)
      .subject(`${this.movie.title} sort aujourd'hui !`)
      .htmlView('emails/release_alert', {
        user: this.user,
        movie: this.movie,
        movieUrl,
      })
      .textView('emails/release_alert_text', {
        user: this.user,
        movie: this.movie,
        movieUrl,
      })
  }
}
