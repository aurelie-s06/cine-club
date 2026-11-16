import Movie from '#models/movie'
import MovieFollow from '#models/movie_follow'
import MovieTransformer from '#transformers/movie_transformer'
import type { HttpContext } from '@adonisjs/core/http'

export default class MoviesController {
  async index({ request, inertia }: HttpContext) {
    const page = Math.max(1, Number(request.input('page', 1)) || 1)
    const search = request.input('search', '')

    const query = Movie.query().orderBy('popularity', 'desc')

    if (search) {
      query.whereLike('title', `%${search}%`)
    }

    const movies = await query.paginate(page, 25)

    return inertia.render('movies/index', {
      movies: MovieTransformer.paginate(movies.all(), movies.getMeta()).useVariant('toSummary'),
      search,
    })
  }

  async show({ params, inertia, auth }: HttpContext) {
    const movie = await Movie.findOrFail(params.id)

    const isFollowing = auth.user
      ? !!(await MovieFollow.query()
          .where('userId', auth.user.id)
          .where('movieId', movie.id)
          .first())
      : false

    return inertia.render('movies/show', {
      movie: MovieTransformer.transform(movie),
      releaseAlert: {
        // La décision se prend ici, pas dans la vue
        canFollow: movie.isUpcoming,
        isFollowing,
      },
    })
  }
}
