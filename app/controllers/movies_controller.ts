import Movie from '#models/movie'
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

  async show({ params, inertia }: HttpContext) {
    const movie = await Movie.findOrFail(params.id)

    return inertia.render('movies/show', {
      movie: MovieTransformer.transform(movie),
    })
  }
}
