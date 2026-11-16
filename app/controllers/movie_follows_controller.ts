import Movie from '#models/movie'
import MovieFollow from '#models/movie_follow'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Suivre / ne plus suivre un film à venir.
 *
 * Aucune de ces actions n'envoie d'email : elles écrivent une ligne en base
 * et répondent tout de suite. L'email part plus tard, depuis le worker,
 * le jour de la sortie (voir app/jobs/dispatch_release_alerts.ts).
 */
export default class MovieFollowsController {
  async store({ params, auth, session, response }: HttpContext) {
    const movie = await Movie.findOrFail(params.movie_id)
    const user = auth.getUserOrFail()

    // Ne jamais faire confiance au client : le bouton peut être forgé
    if (!movie.isUpcoming) {
      session.flash('error', "Ce film est déjà sorti : il n'y a plus d'alerte à programmer.")
      return response.redirect().back()
    }

    await MovieFollow.firstOrCreate({ userId: user.id, movieId: movie.id })

    session.flash('success', `Vous recevrez un email le jour de la sortie de « ${movie.title} ».`)
    return response.redirect().back()
  }

  async destroy({ params, auth, session, response }: HttpContext) {
    const user = auth.getUserOrFail()

    await MovieFollow.query().where('userId', user.id).where('movieId', params.movie_id).delete()

    session.flash('success', 'Alerte de sortie supprimée.')
    return response.redirect().back()
  }
}
