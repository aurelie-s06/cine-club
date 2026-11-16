import env from '#start/env'
import ky, { type KyInstance } from 'ky'

/**
 * https://developer.themoviedb.org/reference/movie-popular-list
 */
export interface TmdbMovie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  original_language: string
}

export class TmdbService {
  #client: KyInstance

  constructor() {
    this.#client = ky.create({
      prefix: env.get('TMDB_BASE_URL'),
      headers: {
        Authorization: `Bearer ${env.get('TMDB_READ_ACCESS_TOKEN').release()}`,
        Accept: 'application/json',
      },
    })
  }

  /**
   * Récupère une page de films populaires (20 films par page).
   */
  popular(page: number = 1): Promise<TmdbMovie[]> {
    return this.#list('movie/popular', page)
  }

  /**
   * Films actuellement au cinéma en France.
   * https://developer.themoviedb.org/reference/movie-now-playing-list
   */
  nowPlaying(page: number = 1): Promise<TmdbMovie[]> {
    return this.#list('movie/now_playing', page)
  }

  /**
   * Prochaines sorties en France.
   * https://developer.themoviedb.org/reference/movie-upcoming-list
   */
  upcoming(page: number = 1): Promise<TmdbMovie[]> {
    return this.#list('movie/upcoming', page)
  }

  /**
   * Les trois listes ont le même format de réponse. La région FR donne les
   * dates de sortie françaises, celles utilisées pour les alertes.
   */
  async #list(endpoint: string, page: number): Promise<TmdbMovie[]> {
    const response = await this.#client
      .get(endpoint, { searchParams: { page, language: 'fr-FR', region: 'FR' } })
      .json<{ results: TmdbMovie[] }>()

    return response.results
  }
}

export default new TmdbService()
