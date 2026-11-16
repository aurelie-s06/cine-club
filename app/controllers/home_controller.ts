import Movie from '#models/movie'
import MovieTransformer from '#transformers/movie_transformer'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Minimum amount of TMDB votes required for a movie to show up in the
 * "top rated" rail, so a single enthusiastic voter cannot push a movie
 * to the top of the list.
 */
const MIN_VOTES_FOR_TOP_RATED = 500

export default class HomeController {
  async index({ inertia }: HttpContext) {
    const today = Movie.today()

    const [featured, popular, newest, upcoming, topRated] = await Promise.all([
      Movie.query().whereNotNull('backdropPath').orderBy('popularity', 'desc').first(),

      Movie.query().orderBy('popularity', 'desc').offset(1).limit(6),

      Movie.query()
        .whereNotNull('releaseDate')
        .where('releaseDate', '<=', today)
        .orderBy('releaseDate', 'desc')
        .limit(6),

      Movie.query().where('releaseDate', '>', today).orderBy('releaseDate', 'asc').limit(6),

      Movie.query()
        .where('voteCount', '>=', MIN_VOTES_FOR_TOP_RATED)
        .orderBy('voteAverage', 'desc')
        .limit(6),
    ])

    return inertia.render('home', {
      featured: MovieTransformer.transform(featured),
      popular: MovieTransformer.transform(popular).useVariant('toSummary'),
      newest: MovieTransformer.transform(newest).useVariant('toSummary'),
      upcoming: MovieTransformer.transform(upcoming).useVariant('toSummary'),
      topRated: MovieTransformer.transform(topRated).useVariant('toSummary'),
    })
  }
}
